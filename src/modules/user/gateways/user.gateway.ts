import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserCacheDbService } from '../../cache/services/user-cache-db.service';
import { CryptocurrencyRateResponse } from '../../cryptocurrency-rate/interfaces/cryptocurrency-rate-response.interface';

@WebSocketGateway({ namespace: 'user' })
export class UserGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(UserGateway.name);

  constructor(private readonly userCacheService: UserCacheDbService) {}

  @WebSocketServer()
  server: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  /* eslint @typescript-eslint/no-unused-vars: ["off", {"argsIgnorePattern": "args"}]*/
  async handleConnection(client: Socket, ...args: any[]) {
    const { id: clientSession } = client;

    // @TODO: Fix next by class-validator
    const { id } = client.handshake.query;
    if (
      typeof id !== 'string' ||
      !Number.isInteger(+id) ||
      (await this.userCacheService.exists(id))
    ) {
      this.logger.warn(
        `The user did not provide an id. [id=${id}] or already connected with the same id`,
      );
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

  async notifyUserAboutRate(session: string, rate: CryptocurrencyRateResponse) {
    this.server.to(session).emit('rate', rate);
  }
}
