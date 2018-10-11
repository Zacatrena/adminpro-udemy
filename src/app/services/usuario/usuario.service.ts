import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import { URL_SERVICES } from '../../config/config';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarLocalStorage();
  }

  renuevaToken() {
    let url = URL_SERVICES + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get(url)
                      .pipe(map( (resp: any) => {
                        this.token = resp.token;
                        localStorage.setItem('token', this.token);
                        console.log('token renovado');

                        return true;
                      }),
                      catchError( err => {
                        this.router.navigate(['/login']);
                        swal('no se pudo renovar token', 'No fue posible renovar token', 'error');
                        return throwError(err);
                      }));
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarLocalStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarLocalStorage( id: string, token: string, usuario: Usuario, menu: any) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('id');
    localStorage.removeItem('token'),
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/login/google';

    return this.http.post( url, { token })
                      .pipe(map( (resp: any)  => {
                        this.guardarLocalStorage(resp.id, resp.token, resp.usuario, resp.menu);
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
                        this.guardarLocalStorage(resp.id, resp.token, resp.usuario, resp.menu);
                        return true;
                      }),
                      catchError( err => {
                        // console.log(err.status);
                        // console.log(err.error.mensaje);
                        swal('Error en el login', err.error.mensaje, 'error');
                        return throwError(err);
                      }));
  }

  crearUsuario( usuario: Usuario) {

    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/usuario';
    return this.http.post(url, usuario)
                        .pipe(map((resp: any) => {
                          swal('Usuario creado', usuario.email, 'success');
                          return resp.usuario;
                        }),
                        catchError( err => {
                          // console.log(err.status);
                          // console.log(err.error);
                          swal(err.error.mensaje, err.error.errors.message, 'error');
                          return throwError(err);
                        }));
  }

  actualizarUsuario( usuario: Usuario) {

    let url = URL_SERVICES + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put(url, usuario)
                .pipe(map((resp: any) => {
                  // Si es el usuario actual-logueado
                  if (usuario === this.usuario) {
                    // tslint:disable-next-line:prefer-const
                    let usuarioDB = resp.usuario;
                    this.guardarLocalStorage(usuarioDB._id, this.token, usuarioDB, this.menu);
                  }
                  swal('Usuario actualizado', usuario.nombre, 'success');

                  return true;
                }),
                catchError( err => {
                  // console.log(err.status);
                  // console.log(err.error);
                  swal(err.error.mensaje, err.error.errors.message, 'error');
                  return throwError(err);
                }));
  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo(archivo, 'usuarios', id)
          .then( (resp: any) => {
            this.usuario.img = resp.usuario.img;
            swal('Imagen Actualizada', this.usuario.nombre, 'success');
            this.guardarLocalStorage(id, this.token, this.usuario, this.menu);
          })
          .catch( () => {
              // console.log( resp.errors);
            });

  }

  cargarUsuarios( desde: number = 0 ) {
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/usuario?desde=' + desde;

    return this.http.get(url);
  }

  buscarUsuario( termino: string ) {
    // tslint:disable-next-line:prefer-const
    let url = URL_SERVICES + '/busqueda/coleccion/usuarios/' + termino;
    return this.http.get(url).pipe(map((resp: any) => resp.usuarios));
  }

  borrarUsuario(id: string) {
    let url = URL_SERVICES + '/usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete(url)
                      .pipe(map(() => {
                        swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
                        return true;
                      }));
  }

}
