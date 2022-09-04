import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import {Server, Socket} from 'socket.io';



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
}
