import { Injectable } from '@nestjs/common';
import { MeetingModel } from 'model/meeting.model';
import { MeetingResponce } from 'dto/responce.dto';

@Injectable()
export class MeetingsFormatter {
  public toMeetingResponse(meetingModel: MeetingModel): MeetingResponce {
    return {
      datetime: meetingModel.datetime,
      personToMeet: meetingModel.personToMeet,
      meetingPoint: meetingModel.meetingPoint,
    };
  }

  public toMeetingsResponce(carModels: MeetingModel[]): Array<MeetingResponce> {
    return carModels.map(this.toMeetingResponse);
  }
}
