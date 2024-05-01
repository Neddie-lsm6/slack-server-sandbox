import { ChatService } from './chat.service';
import { ChannelCreateEventDto } from './event.challange.dto';
import { ChatDto } from './chat.dto';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { postFormData } from './slack-api';

@Controller('/event')
export class EventController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getChatHello(): string {
    return this.chatService.getHello();
  }

  @Post()
  async subscriptEvent(
    @Body() payload: ChannelCreateEventDto,
  ): Promise<ChannelCreateEventDto> {
    // console.log(chat);
    console.log('subscriptEvent CALLED !!!');
    console.log(payload);

    const chat = new ChatDto();
    chat.channel = payload.event.channel.id;
    chat.token = 'xoxb-6969122204867-7058643464320-MyPKvYyBsaE68SMPWJKgEbFx';
    chat.message = 'Hello! This is new channel message by NeddieBot.';

    try {
      const response = await postFormData<ChatDto>('/chat.postMessage', chat);
      const createdUser = response.result;
      console.log(createdUser);
      return payload;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create user');
    }

    // console.log(chat.token, chat.channel, chat.message);
    return payload;
  }
}
