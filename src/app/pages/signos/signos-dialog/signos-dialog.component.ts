import { Component, OnInit, Inject } from '@angular/core';
import { Signos } from 'src/app/_model/signos';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SignosService } from 'src/app/_service/signos.service';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-signos-dialog',
  templateUrl: './signos-dialog.component.html',
  styleUrls: ['./signos-dialog.component.css']
})
export class SignosDialogComponent implements OnInit {
  
 
  pacientes: Paciente[] = [];

  idPacienteSeleccionado: number;
  signos: Signos;

  fecha: Date = new Date();

  constructor(private pacienteService: PacienteService,private dialogRef: MatDialogRef<SignosDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Signos, private signosService: SignosService) { }

  ngOnInit() {
    this.signos = new Signos();
    this.signos.idSignos = this.data.idSignos;
    this.signos.paciente = this.data.paciente;
    
    this.signos.fecha = this.data.fecha;
    this.signos.temperatura = this.data.temperatura;
    this.signos.pulso = this.data.pulso;
    this.signos.ritmo = this.data.ritmo;
    
    this.idPacienteSeleccionado = this.data.paciente != null ? this.data.paciente.idPaciente : 0;
    this.listarPacientes();
    console.log("ingresa la primera vez::" + this.idPacienteSeleccionado)
  }

 
  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  cancelar() {
    this.dialogRef.close();
  }

  operar() {
    if (this.signos != null && this.signos.idSignos > 0) {
      //BUENA PRACTICA
      this.signosService.modificar(this.signos).pipe(switchMap(() => {        
        return this.signosService.listar();
      })).subscribe(signos => {
        this.signosService.signosCambio.next(signos);
        this.signosService.mensajeCambio.next("SE MODIFICO");
      });
    } else {
      //MALA PRACTICA SUBSCRIBE DENTRO DE OTOR SUBSCRIBE
      let paciente = new Paciente();
      paciente.idPaciente = this.idPacienteSeleccionado;
      this.signos.paciente = paciente;

      //ISODATE
      let tzoffset = (this.fecha).getTimezoneOffset() * 60000;
      let localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
      //console.log(localISOTime);//yyy-mm-ddTHH:mm:ss
      this.signos.fecha = localISOTime;

      this.signosService.registrar(this.signos).subscribe(() => {
        this.signosService.listar().subscribe(signos => {
          this.signosService.signosCambio.next(signos);
          this.signosService.mensajeCambio.next("SE REGISTRO");
        });
      });
    }
    this.dialogRef.close();
  }

}
