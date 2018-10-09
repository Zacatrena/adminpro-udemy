import { Injectable } from '@angular/core';

import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [];

  // menu: any = [
  //   {
  //     titulo: 'Principal',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Dasboard', url: '/dashboard' },
  //       { titulo: 'ProgressBar', url: '/progress' },
  //       { titulo: 'Gráficas', url: '/graficas1' },
  //       { titulo: 'Promesas', url: '/promesas' },
  //       { titulo: 'RxJs', url: '/rxjs' }
  //     ]
  //   },
  //   {
  //     titulo: 'Mantenimientos',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Usuarios', url: '/usuarios' },
  //       { titulo: 'Médicos', url: '/medicos' },
  //       { titulo: 'Hospitales', url: '/hospitales' }
  //     ]
  //   }
  // ];

  constructor(
    public _usuarioService: UsuarioService
  ) { }

  cargarMenu() {
    // console.log('SidebarService-cargarMenu(): ', this._usuarioService.menu);
    this.menu = this._usuarioService.menu;
  }
}
