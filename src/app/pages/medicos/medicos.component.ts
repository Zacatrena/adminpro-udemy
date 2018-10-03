import { Component, OnInit } from '@angular/core';

import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  cargando: boolean = true;

  constructor(
    public _medicosService: MedicoService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;

    this._medicosService.cargarMedicos(this.desde)
                          .subscribe( (medicos: Medico[]) => {
                            this.medicos = medicos;
                            this.cargando = false;
                          });
  }

  cambiarDesde( valor: number ) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;

    if (desde >= this._medicosService.totalMedicos || desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
  }

  buscarMedico( termino: string ) {
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;
    this._medicosService.buscarMedicos(termino)
                            .subscribe( (medicos: Medico[]) => {
                              // console.log(hospitales);
                              this.medicos = medicos;
                              this.cargando = false;
                              // TODO: ¿resetear desde + paginar?
                            });
  }

  borrarMedico(medico: Medico) {

    swal({
      title: '¿Está seguro?',
      text: 'Se borrará el médico: ' + medico.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then(borrar => {
      if (borrar) {
        this._medicosService.borrarMedico(medico._id)
                                .subscribe(borrado => {
                                  this.cargarMedicos();
                                });
      }
    });

  }

  actualizarImagen(id: string) {}

}
