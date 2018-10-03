import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UsuarioService } from '../usuario/usuario.service';
import { URL_SERVICES } from '../../config/config';
import { map } from 'rxjs/operators';
import { Medico } from '../../models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  totalMedicos: number = 0;

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos( desde: number = 0 ) {
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/medico?desde=' + desde;

    return this.http.get(url)
                  .pipe(map((resp: any) => {
                    this.totalMedicos = resp.total;
                    return resp.medicos;
                  }));
  }

  buscarMedicos(termino: string) {
     // tslint:disable-next-line:prefer-const
     let url = URL_SERVICES + '/busqueda/coleccion/medicos/' + termino;
     return this.http.get(url).pipe(map((resp: any) => resp.medicos));
  }

  borrarMedico(id: string) {

    let url = URL_SERVICES + '/medico/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete(url)
                      .pipe(map((resp: any) => {
                        swal('Medico Borrado', 'Eliminado correctamente', 'success');
                        return true;
                      }));

  }

  guardarMedico( medico: Medico) {

    let url = URL_SERVICES + '/medico';

    if (medico._id) {
      // Actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, medico)
                        .pipe(map( (resp: any) => {
                          swal('Médico actualizado', medico.nombre, 'success');
                          return resp.medico;
                        }));

    } else {
      // Creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, medico)
                  .pipe(map( (resp: any ) => {

                    swal('Médico creado', medico.nombre, 'success');
                    return resp.medico;
                  }));
      }
  }

  cargarMedico( id: string ) {
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/medico/' + id;

    return this.http.get(url).pipe(map( (resp: any) => resp.medico ));
  }
}
