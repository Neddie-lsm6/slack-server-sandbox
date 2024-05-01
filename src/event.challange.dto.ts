export class ChannelDto {
  readonly id: string;
  readonly name: string;
  readonly created: string;
  readonly creator: string;
}

export class EventDto {
  readonly type: string;
  readonly channel: ChannelDto;
}

export class ChannelCreateEventDto {
  readonly type: string;
  readonly event: EventDto;
  readonly challenge: string;
}

export class EventChallengeDto {
  readonly challenge: string;
}
