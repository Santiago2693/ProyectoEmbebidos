import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
  humedad = 3;
  color = "#1976D2"

  mensaje = "";
  fecha = new Date();
  formGroup1?: FormGroup;
  formGroup2?: FormGroup;



  constructor(
    public readonly websocketsService: WebsocketsService,
    private readonly formBuilder: FormBuilder,

  ) {
  }

  ngOnInit(): void {
    this.logicaConexionArduino();
    this.prepararFormularioMensaje();
    this.prepararFormularioColor();
  }

  prepararFormularioColor() {
    this.formGroup2 = this.formBuilder
      .group(
        {
          color: new FormControl(
            {
              value: this.color,
              disabled: false
            },
            [
              Validators.required, // min, max, minLength maxLength, email, pattern

            ]
          )
        }
      );
  }

  enviarMensaje() {
    if (this.formGroup1) {
      const mensaje1 = this.formGroup1.get('mensaje');
      if (mensaje1) {
        this.mensaje = mensaje1.value;
        this.websocketsService.ejecutarEventoEnviarMensaje(this.mensaje)
      }
    }
  }

  private prepararFormularioMensaje() {
    this.formGroup1 = this.formBuilder
      .group(
        {
          mensaje: new FormControl(
            {
              value: this.mensaje,
              disabled: false
            },
            [
              Validators.required, // min, max, minLength maxLength, email, pattern
              Validators.maxLength(13),
              Validators.pattern("[A-Za-z0-9]+"),
            ]
          )
        }
      );
  }


  logicaConexionArduino() {
    this.desSuscribirse();
    const respEscucharEventoSaludar = this.websocketsService.escucharEventoSaludar()
      .subscribe(
        {
          next: (data) => {
            const informacion = data;
            console.log(data);
          },
          error: (error) => {
            console.error({error});
          }
        }
      );
    const respEscucharEventoTemperaturaYHumedad = this.websocketsService.escucharEventoTemperaturaYHumedad()
      .subscribe(
        {
          next: (data) => {
            const informacion=data as {temperatura:number, humedad:number};
            if(informacion.temperatura){
              this.temperatura = informacion.temperatura;
            }
            if(informacion.humedad){
              this.humedad = informacion.humedad;
            }
          },
          error: (error) => {
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

  }

  enviarColor() {
    if (this.formGroup2) {
      const color1 = this.formGroup2.get('color');
      if (color1) {
        this.color = color1.value;
        this.websocketsService.ejecutarEventoEnviarRGB(this.color)

      }
    }
  }
}
