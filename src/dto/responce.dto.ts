import { ApiProperty } from '@nestjs/swagger';

export class MeetingResponce {
  @ApiProperty()
  datetime: Date;

  @ApiProperty()
  personToMeet: string;

  @ApiProperty()
  meetingPoint: string;
}
