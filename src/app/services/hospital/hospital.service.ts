import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Hospital } from '../../models/hospital.model';
import { URL_SERVICES } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  totalHospitales: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) {
   }

  cargarHospitales( desde: number = 0 ) {
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/hospital?desde=' + desde;

    // return this.http.get(url);
    return this.http.get(url)
                      .pipe(map((resp: any) => {
                        this.totalHospitales = resp.total;
                        return resp.hospitales;
                      }));
  }

  obtenerHospital(id: string) {
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/hospital/' + id;
    return this.http.get(url)
                  .pipe(map((resp: any) => resp.hospital));
  }

  crearHospital( nombre: string ) {
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/hospital';
    url += '?token=' + this._usuarioService.token;

    return this.http.post(url, {nombre})
                        .pipe(map((resp: any) => {
                          swal('Hospital creado', nombre, 'success');
                          return resp.hospital;
                        }));
  }

  borrarHospital(id: string) {

    let url = URL_SERVICES + '/hospital/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url)
                      .pipe(map((resp: any) => {
                        swal('Hospital Borrado', 'Eliminado correctamente', 'success');
                        return true;
                      }));
  }

  buscarHospital(termino: string) {
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/busqueda/coleccion/hospitales/' + termino;
    return this.http.get(url).pipe(map((resp: any) => resp.hospitales));
  }

  actualizarHospital(hospital: Hospital) {

    let url = URL_SERVICES + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, hospital)
                .pipe(map((resp: any) => {

                  swal('Hospital actualizado', hospital.nombre, 'success');

                  return true;
                }));
  }
}
