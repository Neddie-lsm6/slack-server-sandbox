import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  getHello(): string {
    return 'Chat Hello Message';
  }
}
