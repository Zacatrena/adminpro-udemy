import { RouterModule, Routes } from '@angular/router';
import { RxjsComponent } from './rxjs/rxjs.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { ProfileComponent } from './profile/profile.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HospitalesComponent } from './hospitales/hospitales.component';
import { MedicoComponent } from './medicos/medico.component';
import { MedicosComponent } from './medicos/medicos.component';
import { BusquedaComponent } from './busqueda/busqueda.component';

// Guards
import { AdminGuard, VerificaTokenGuard } from '../services/service.index';

const pagesRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [ VerificaTokenGuard ],
    data: { titulo: 'Dashboard', description: 'Página principal' }
  },
  { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress', description: 'Barras de progreso' } },
  { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas', description: 'Gráficos de ejemplo' } },
  { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas', description: 'Prácticas con promise' } },
  { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs', description: 'Prácticas con observer' } },
  // tslint:disable-next-line:max-line-length
  { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes del Tema', description: 'Asignar Tema al site' } },
  { path: 'perfil', component: ProfileComponent, data: { titulo: 'Perfil de usuario' } },
  { path: 'busqueda/:termino', component: BusquedaComponent, data: { titulo: 'Buscador' } },
  // Mantenimientos
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [ AdminGuard ],
    data: { titulo: 'Mantenimiento Usuarios' }
  },
  { path: 'medicos', component: MedicosComponent, data: { titulo: 'Mantenimiento Médicos' } },
  { path: 'medico/:id', component: MedicoComponent, data: { titulo: 'Actualizar Médico' } },
  { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Mantenimiento Hospitales' } },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];


export const PAGES_ROUTES = RouterModule.forChild ( pagesRoutes );
