import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subsciption: Subscription;

  constructor() {

    this.subsciption = this.devuelveObservable()
    .subscribe(
      numero => console.log('Subs', numero),
      error => console.log('Error en el observer', error),
      () => console.log('El observador terminó!')
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log('La página se va a cerrar');
    this.subsciption.unsubscribe();
  }

  devuelveObservable(): Observable<any> {

    return new Observable( (observer: Subscriber<any>) => {

      let contador = 0;
      // tslint:disable-next-line:prefer-const
      let intervalo = setInterval( () => {
        contador++;

        const salida = {
          valor: contador
        };

        observer.next( salida );

        // if (contador === 3) {
        //   clearInterval( intervalo );
        //   observer.complete();
        // }

        // if ( contador === 2 ) {
        //   // clearInterval( intervalo );
        //   observer.error( 'Auxilio!');
        // }

      }, 1000 );
    }).pipe(
      map( resp =>  resp.valor ),
      filter( ( valor, index ) => {
        // console.log('Filter', valor, index);

        if ( (valor % 2 ) === 1 ) {
          // Impar
          return true;
        } else {
          // Par
          return false;
        }
      })
    );

  }

}
