import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatController } from './chat.controller';
import { FlexController } from './flex.controller'
import { ChatService } from './chat.service';
import { EventController } from './event.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [AppController, ChatController, EventController, FlexController],
  providers: [AppService, ChatService],
})
export class AppModule {}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전체적으로 사용하기 위해
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
  ],
})
export class EnvModule {}
