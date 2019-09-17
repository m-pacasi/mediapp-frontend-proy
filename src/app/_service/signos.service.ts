import { Injectable } from '@angular/core';
import { Signos } from '../_model/signos';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SignosService {

  signosCambio = new Subject<Signos[]>();
  mensajeCambio = new Subject<string>();

  url: string = `${environment.HOST}/signos`;
  //url: string = `${environment.HOST}/${environment.MICRO_CRUD}/medicos`;

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Signos[]>(this.url);
  }

  listarPorId(idsignos: number) {
    return this.http.get<Signos>(`${this.url}/${idsignos}`);
  }

  registrar(signos: Signos) {
    return this.http.post(this.url, signos);
  }

  modificar(signos: Signos) {
    return this.http.put(this.url, signos);
  }

  eliminar(idsignos: number) {
    return this.http.delete(`${this.url}/${idsignos}`);
  }
}
