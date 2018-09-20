import { Injectable } from '@angular/core';
import { promise } from 'protractor';

import { URL_SERVICES } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class SubirArchivoService {

  constructor() { }

  subirArchivo( archivo: File, tipo: string, id: string ) {

    return new Promise( (resolve, reject) => {

      // tslint:disable-next-line:prefer-const
      let formData = new FormData();
      // tslint:disable-next-line:prefer-const
      let xhr = new XMLHttpRequest();

      formData.append('imagen', archivo, archivo.name);

      xhr.onreadystatechange = function() {
        // Cuando termine el proceso (xhr.readyState === 4)
        if (xhr.readyState === 4) {
          // si todo ha ido bien
          if (xhr.status === 200) {
            console.log('Imagen subida');
            resolve( JSON.parse(xhr.response) );
          } else {
            console.log('Falló la subida');
            reject( xhr.response );
          }
        }
      };

      // tslint:disable-next-line:prefer-const
      let url = URL_SERVICES + '/upload/' + tipo + '/' + id;
      xhr.open('PUT', url, true);
      xhr.send( formData );

    });

  }
}
