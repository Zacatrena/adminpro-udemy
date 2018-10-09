import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { UsuarioService } from '../../services/service.index';
import { Usuario } from '../../models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;

  @ViewChild('txtSearch') searchField: ElementRef;

  constructor(
    public _usuarioService: UsuarioService,
    public router: Router
    ) { }

  ngOnInit() {
    this.usuario = this._usuarioService.usuario;
  }

  buscar( termino ) {
    this.router.navigate(['/busqueda', termino]);
  }

  // setFocusSearch() {
  //   // tslint:disable-next-line:prefer-const
  //   this.searchField.nativeElement.focus();
  //   console.log('ppppp');

  // }

}
