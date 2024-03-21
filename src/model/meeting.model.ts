export class MeetingModel {
  constructor(
    public readonly datetime: Date,
    public readonly personToMeet: string,
    public readonly meetingPoint: string,
  ) {}
}
