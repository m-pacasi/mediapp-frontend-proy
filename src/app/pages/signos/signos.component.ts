import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { Signos } from 'src/app/_model/signos';
import { SignosService } from 'src/app/_service/signos.service';
import { SignosDialogComponent } from './signos-dialog/signos-dialog.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-signos',
  templateUrl: './signos.component.html',
  styleUrls: ['./signos.component.css']
})
export class SignosComponent implements OnInit {

  

  maxFecha: Date = new Date();
  displayedColumns = ['idsignos','paciente', 'fecha', 'temperatura', 'pulso', 'ritmo','acciones'];

  dataSource: MatTableDataSource<Signos>;
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  
  constructor(private signosService: SignosService, private dialog: MatDialog, private snackBar: MatSnackBar) { }



  ngOnInit() {
    this.signosService.signosCambio.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      console.log("DATA signos: "+data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.signosService.mensajeCambio.subscribe(data => {
      this.snackBar.open(data, 'AVISO', {
        duration: 2000
      });
    });

    this.signosService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openDialog(signos?: Signos) {
    console.log("Signos:: "+ Signos);
    let sig = signos != null ? signos : new Signos();
    this.dialog.open(SignosDialogComponent  , {
      width: '350px',
      data: sig
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminar(signos: Signos) {

    this.signosService.eliminar(signos.idSignos).pipe(switchMap(() => {
      return this.signosService.listar();
    })).subscribe(data => {
      this.signosService.signosCambio.next(data);
      this.signosService.mensajeCambio.next("Se elimino");
    });

    /*this.medicoService.eliminar(medico.idMedico).subscribe(() => {
      this.medicoService.listar().subscribe(medicos => {
        this.medicoService.medicoCambio.next(medicos);
        this.medicoService.mensajeCambio.next("Se elimino");
      });
    });*/
  }

}
