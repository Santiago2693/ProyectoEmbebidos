import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class WebsocketsService {
  constructor(private socket: Socket) {
  }


  ejecutarEventoSaludar() {
    // Emitimos un evento
    const resp = this.socket.emit(
      'saludar', {});
  }

  escucharEventoSaludar() {
    return this.socket.fromEvent('escucharEventoSaludar');

  }


  escucharEventoTemperaturaYHumedad() {
    return this.socket.fromEvent('escucharEventoTemperaturaYHumedad');

  }

  ejecutarEventoEnviarRGB(color: string) {
    // Emitimos un evento
    const resp = this.socket.emit(
      'enviarRGB', {
        color: color
      });
  }


  ejecutarEventoEnviarMensaje(mensaje: string) {
    // Emitimos un evento
    const resp = this.socket.emit(
      'enviarMensaje', {

        mensaje: mensaje

      });
  }


}

