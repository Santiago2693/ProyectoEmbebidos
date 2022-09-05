import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway} from "@nestjs/websockets";
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
            message: { r: number, g: number, b: number },
        @ConnectedSocket()
            socket: Socket
    ) {
        socket.broadcast
            .emit(
                'escucharEventoRGB',
                {
                    r: message.r,
                    g: message.g,
                    b: message.b
                });
        return 'ok';
    }

    @SubscribeMessage('enviarMensaje')
    enviarMensaje(
        @MessageBody()
            message: { mensaje:string },
        @ConnectedSocket()
            socket: Socket
    ) {
        socket.broadcast
            .emit(
                'escucharMensaje',
                {
                    mensaje: message.mensaje
                });
        return 'ok';
    }
}


