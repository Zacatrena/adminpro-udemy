import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { URL_SERVICES } from '../../config/config';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarLocalStorage();
  }

  estaLogueado() {
    console.log('this.token.length: ', this.token.length);

    return (this.token.length > 5) ? true : false;
  }

  cargarLocalStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarLocalStorage( id: string, token: string, usuario: Usuario) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token'),
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/login/google';

    return this.http.post( url, { token })
                      .pipe(map( (resp: any)  => {
                        this.guardarLocalStorage(resp.id, resp.token, resp.usuario);
                        return true;
                      }));
  }

  login( usuario: Usuario, recordar: boolean = false ) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/login';
    return this.http.post( url, usuario )
                      .pipe(map( (resp: any) => {

                        this.guardarLocalStorage(resp.id, resp.token, resp.usuario);
                        return true;
                      }));
  }

  crearUsuario( usuario: Usuario) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/usuario';
    return this.http.post(url, usuario)
                        .pipe(map((resp: any) => {
                          swal('Usuario creado', usuario.email, 'success');
                          return resp.usuario;
                        }));
  }

  actualizarUsuario( usuario: Usuario) {
    let url = URL_SERVICES + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario)
                      .pipe(map((resp: any) => {

                        // tslint:disable-next-line:prefer-const
                        let usuarioDB = resp.usuario;
                        this.guardarLocalStorage(usuarioDB._id, this.token, usuarioDB);
                        swal('Usuario actualizado', usuario.nombre, 'success');

                        return true;
                      }));
  }

  cambiarImagen( archivo: File, id: string ) {
    console.log('PPPPP');

    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
          .then( (resp: any) => {
            this.usuario.img = resp.usuario.img;
            swal('Imagen Actualizada', this.usuario.nombre, 'success');
            this.guardarLocalStorage(id, this.token, this.usuario);
          })
          .catch( resp => {
            console.log( resp);

          });

  }

}
