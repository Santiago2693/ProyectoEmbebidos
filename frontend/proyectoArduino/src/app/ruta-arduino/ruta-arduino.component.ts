import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {WebsocketsService} from 'src/servicios/websockets/websockets.service';

@Component({
  selector: 'app-ruta-arduino',
  templateUrl: './ruta-arduino.component.html',
  styleUrls: ['./ruta-arduino.component.scss']
})
export class RutaArduinoComponent implements OnInit {
  arregloSubscripciones: Subscription[] = [];
  temperatura = 0;
  presion = 0;
  r = 0;
  g = 0;
  b = 0;
  mensaje = "";

  constructor(
    public readonly websocketsService: WebsocketsService,
  ) {
  }

  ngOnInit(): void {
    this.logicaConexionArduino();
  }

  logicaConexionArduino() {
    this.desSuscribirse();
    const respEscucharEventoSaludar=this.websocketsService.escucharEventoSaludar()
      .subscribe(
        {
          next:(data)=>{
            const informacion=data;
            console.log(data);
          },
          error:(error)=>{
            console.error({error});
          }
        }
      );
    const respEscucharEventoTemperaturaYHumedad=this.websocketsService.escucharEventoTemperaturaYHumedad()
      .subscribe(
        {
          next:(data)=>{
            const informacion=data;
            console.log(data);
          },
          error:(error)=>{
            console.error({error});
          }
        }
      );
  }

  desSuscribirse() {
    this.arregloSubscripciones.forEach(
      (suscripcion) => {
        suscripcion.unsubscribe()
      }
    );
    this.arregloSubscripciones = [];

  }

  saludar() {
    this.websocketsService.ejecutarEventoSaludar();
    this.websocketsService.ejecutarEventoEnviarRGB(125,125,125);
    this.websocketsService.ejecutarEventoEnviarMensaje("Probando el saludo");

  }
}
