import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway} from "@nestjs/websockets";
import hexRgb from "hex-rgb";
import {Socket} from 'socket.io';

@WebSocketGateway(
    8080,
    {
        cors: {
            origin: '*',
        }
    })
export class EventosGateway {
    @SubscribeMessage('saludar')
    devolverHola(
        @ConnectedSocket()
            socket: Socket
    ) {
        socket.broadcast
            .emit(
                'escucharEventoSaludar',
                {
                    mensaje: 'Bienvenido '
                });
        return 'ok';
    }

    @SubscribeMessage('enviarTemperaturaYHumedad')
    enviarTemperaturaYHumedad(
        @MessageBody()
            message: { temperatura: number, humedad: number },
        @ConnectedSocket()
            socket: Socket
    ) {

        socket.broadcast
            .emit(
                'escucharEventoTemperaturaYHumedad',
                {
                    temperatura: message.temperatura,
                    humedad: message.humedad
                });
        return 'ok';
    }

    @SubscribeMessage('enviarRGB')
    enviarRGB(
        @MessageBody()
            message: { color: string },
        @ConnectedSocket()
            socket: Socket
    ) {
        const rExp: RegExp = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!rExp.test(message.color)) {
            message.color="#ff0000";
        }
        console.log(hexRgb(message.color));

        socket.broadcast
            .emit(
                'escucharEventoRGB',
                {
                    r: 4,
                    g: 4,
                    b: 5
                });
        return 'ok';
    }

    @SubscribeMessage('enviarMensaje')
    enviarMensaje(
        @MessageBody()
            message: { mensaje: string },
        @ConnectedSocket()
            socket: Socket
    ) {
        if (message.mensaje.length > 13) {
            message.mensaje = message.mensaje.substr(0, 13)
        } else {
            let longitud = message.mensaje.length;
            message.mensaje = message.mensaje + ' '.repeat(13 - longitud);

        }

        socket.broadcast
            .emit(
                'escucharMensaje',
                {
                    mensaje: message.mensaje
                });
        return 'ok';
    }
}


