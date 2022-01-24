import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

// @WebSocketGateway()
@WebSocketGateway({ namespace: 'user' })
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('UserGateway');

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    // throw new Error('Method not implemented.'); - comment this
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('message', {
      // client,
      payload,
    });
    return 'Hello world!';
  }

  @SubscribeMessage('send_message')
  // @SubscribeMessage('message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('send_message', {
      content,
    });
    // const author = await this.chatService.getUserFromSocket(socket);
    // const message = await this.chatService.saveMessage(content, author);
    const message = content + ' [as received]';

    // this.server.sockets.emit('receive_message', message);
    // this.server.sockets.emit('receive_message', message);
    // this.server.sockets.emit('receive_message', { name: 'user' }, message);
    // this.server.sockets.to('user').emit('receive_message', message);
    // this.server.to('user').emit('receive_message', message);
    this.server.emit('receive_message', message);

    return message;
  }

  async notifyUserAboutRate(userId: number, btcRate: number) {
    this.server.emit('rate', btcRate);
  }
}
