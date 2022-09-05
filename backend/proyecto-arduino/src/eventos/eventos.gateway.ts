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
            message: { color: string },
        @ConnectedSocket()
            socket: Socket
    ) {
        const rExp: RegExp = /#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!rExp.test(message.color)) {
            message.color = "#ff0000";
        }
        var red = 255;
        var green = 0;
        var blue = 0;
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(message.color);
        if (result) {
            red = parseInt(result[1], 16);
            green = parseInt(result[2], 16);
            blue = parseInt(result[3], 16);
        }
        red = Math.abs(255 - red);
        green = Math.abs(255 - green);
        blue = Math.abs(255 - blue);
        var r = red.toString();
        var g = green.toString();
        var b = blue.toString();
        if (r.length != 3) {
            r = '0'.repeat(3 - r.length) + r;
        }
        if (g.length != 3) {
            g = '0'.repeat(3 - g.length) + g;
        }
        if (b.length != 3) {
            b = '0'.repeat(3 - b.length) + b;
        }


        socket.broadcast
            .emit(
                'escucharEventoRGB',
                {
                    r: r,
                    g: g,
                    b: b
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


