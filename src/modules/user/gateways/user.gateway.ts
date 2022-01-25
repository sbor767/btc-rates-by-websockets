import { Logger } from '@nestjs/common';
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
import { Server, Socket } from 'socket.io';
import { UserCacheDbService } from '../../cache/services/user-cache-db.service';

@WebSocketGateway({ namespace: 'user' })
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(UserGateway.name);

  constructor(private readonly userCacheService: UserCacheDbService) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const { id: clientSession } = client;

    // @TODO: Fix next by class-validator
    const { id } = client.handshake.query;
    if (typeof id !== 'string' || !Number.isInteger(+id)) {
      this.logger.warn(`The user did not provide an id. [id=${id}]`);
      // https://stackoverflow.com/a/66184318
      client.disconnect();
      return;
    }

    await this.userCacheService.set(id, clientSession);
    this.logger.log(`User with id=${id} connected with session: ${client.id}`);
  }

  async handleDisconnect({ id: clientSession }: Socket) {
    await this.userCacheService.delete(clientSession);
    this.logger.log(`Client disconnected: ${clientSession}`);
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

  async notifyUserAboutRate(session: string, btcRate: number) {
    this.server.emit('rate', btcRate);
  }
}
