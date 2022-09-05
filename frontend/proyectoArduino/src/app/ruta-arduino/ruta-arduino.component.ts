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
  presion = 0;
  r = 0;
  g = 0;
  b = 0;
  color = `#ffdd2d`;
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
        console.log(this.mensaje)
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
              Validators.maxLength(30),
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
            const informacion = data;
            console.log(data);
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
    this.websocketsService.ejecutarEventoEnviarRGB(125, 125, 125);
    this.websocketsService.ejecutarEventoEnviarMensaje("Probando el saludo");

  }
}
