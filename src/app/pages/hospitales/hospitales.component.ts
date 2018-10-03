import { Component, OnInit } from '@angular/core';

import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public _hospitalService: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe(resp => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;

    this._hospitalService.cargarHospitales(this.desde)
                            .subscribe( (hospitales: Hospital[]) => {
                              // console.log(resp);
                              this.totalRegistros = this._hospitalService.totalHospitales;
                              this.hospitales = hospitales;
                              this.cargando = false;
                            });
  }

  cambiarDesde( valor: number ) {
    // tslint:disable-next-line:prefer-const
    let desde = this.desde + valor;

    if (desde >= this.totalRegistros || desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarHospitales();
  }

  buscarHospital( termino: string ) {
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;
    this._hospitalService.buscarHospital(termino)
                            .subscribe( (hospitales: Hospital[]) => {
                              // console.log(hospitales);
                              this.hospitales = hospitales;
                              this.cargando = false;
                              // TODO: ¿resetear desde + paginar?
                            });
  }

  guardarHospital(hospital: Hospital) {
    this._hospitalService.actualizarHospital(hospital).subscribe();
  }

  borrarHospital(hospital: Hospital) {

    swal({
      title: '¿Está seguro?',
      text: 'Se borrará el hospital: ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true
    })
    .then(borrar => {
      if (borrar) {
        this._hospitalService.borrarHospital(hospital._id)
                                .subscribe(borrado => {
                                  this.cargarHospitales();
                                });
      }
    });

  }

  crearHospital() {

    swal({
      title: 'Crear hospital',
      text: 'Entre el nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then( (valor: string ) => {

      if ( !valor || valor.length === 0 ) {
        return;
      }

      this._hospitalService.crearHospital( valor )
              .subscribe( () => this.cargarHospitales() );

    });
  }

  actualizarImagen(id: string) {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

}
