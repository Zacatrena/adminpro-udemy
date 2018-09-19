import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { element } from 'protractor';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;
  auth2: any;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
    ) { }

  ngOnInit() {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '676652748338-fb9nj3nsbr0pe1s09u2uf1q2llkgf813.apps.googleusercontent.com',
        cookiepolicy: 'single_host-origin',
        scope: 'profile email'
      });

      this.attachSignin( document.getElementById('btnGoogle'));
    });
  }

  attachSignin( element ) {

    this.auth2.attachClickHandler( element, {}, (googleUser) => {

      // tslint:disable-next-line:prefer-const
      // let profile = googleUser.getBasicProfile();
      // tslint:disable-next-line:prefer-const
      let token = googleUser.getAuthResponse().id_token;

      this._usuarioService.loginGoogle( token )
                              .subscribe( () => window.location.href = '#/dashboard');
                              // .subscribe( () => this.router.navigate(['/dashboard']));
    });
  }

  iniciarSesion( form: NgForm) {

    if ( form.invalid) {
      return;
    }

    // tslint:disable-next-line:prefer-const
    let usuario = new Usuario(null, form.value.email, form.value.password);

    this._usuarioService.login(usuario, form.value.recuerdame)
                  .subscribe( correcto => this.router.navigate(['/dashboard']));
  }

}
