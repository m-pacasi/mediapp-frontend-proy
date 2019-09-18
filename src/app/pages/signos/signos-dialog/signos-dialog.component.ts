import { Component, OnInit, Inject } from '@angular/core';
import { Signos } from 'src/app/_model/signos';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SignosService } from 'src/app/_service/signos.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-signos-dialog',
  templateUrl: './signos-dialog.component.html',
  styleUrls: ['./signos-dialog.component.css']
})
export class SignosDialogComponent implements OnInit {

  signos: Signos;

  fecha: Date = new Date();

  constructor(private dialogRef: MatDialogRef<SignosDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: Signos, private signosService: SignosService) { }

  ngOnInit() {
    console.log("dialog ingresa"+ this.signos);
    this.signos = new Signos();
    this.signos.idSignos = this.data.idSignos;
    this.signos.paciente = this.data.paciente;
    this.signos.fecha = this.data.fecha;
    this.signos.temperatura = this.data.temperatura;
    this.signos.pulso = this.data.pulso;
    this.signos.ritmo = this.data.ritmo;
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
