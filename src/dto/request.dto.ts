import { ApiProperty } from '@nestjs/swagger';

export class MeetingBody {
  @ApiProperty()
  datetime: Date;

  @ApiProperty()
  personToMeet: string;

  @ApiProperty()
  meetingPoint: string;
}

export class MeetingItem {
  @ApiProperty({ type: MeetingBody })
  meeting: MeetingBody;
}

export class MeetingsBodyRequest {
  @ApiProperty({ isArray: true, type: MeetingItem })
  meetings: Array<MeetingItem>;
}
