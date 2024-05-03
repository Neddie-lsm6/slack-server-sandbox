import { ChatService } from './chat.service';
import { ChatDto } from './chat.dto';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { postFormData } from './slack-api';


@Controller('/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getChatHello(): string {
    return this.chatService.getHello();
  }

  @Post()
  async postMessage(@Body() chat: ChatDto): Promise<ChatDto> {
    console.log(chat.token, chat.channel, chat.message);
    try {
      const response = await postFormData<ChatDto>('/chat.postMessage', chat);
      const createdUser = response.result;
      console.log(createdUser);
      return createdUser;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create user');
    }
  }
}
