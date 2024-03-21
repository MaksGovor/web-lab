import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import * as fsp from 'node:fs/promises';
import { MeetingsBodyRequest } from 'dto/request.dto';
import { Builder } from 'xml2js';
import { MeetingModel } from 'model/meeting.model';
import { XmlToObjectConverter } from 'util/xml-to-model';

import { ApplicationError } from 'common/aplication.error';

@Injectable()
export class MeetingsService {
  private readonly dataDirPath: string;
  private readonly dataFileName: string;
  private meetings: MeetingModel[];
  private lastFileUpdate: Date;

  constructor(
    private readonly configService: ConfigService,
    private readonly xmlToObjectConverter: XmlToObjectConverter,
  ) {
    this.dataDirPath = this.configService.get<string>('data.dataDirPath');
    this.dataFileName = this.configService.get<string>('data.dataFileName');
  }

  public async storeMeetingsXmlFile(data: string | Buffer): Promise<void> {
    const filePath = path.join(this.dataDirPath, this.dataFileName);
    await fsp.writeFile(filePath, data);
  }

  public async storeMeetingsXmlFileFromJson(
    data: MeetingsBodyRequest,
  ): Promise<void> {
    const builder = new Builder();
    const xml = builder.buildObject(data);

    await this.storeMeetingsXmlFile(xml);
  }

  private async getAllMeetings(): Promise<MeetingModel[]> {
    const filePath = path.join(this.dataDirPath, this.dataFileName);
    const parsedData = await this.xmlToObjectConverter.convertXmlToObject(
      filePath,
    );
    const meeting = parsedData.meetings?.meeting;

    if (!meeting)
      throw new XmlDataFileIsNotValidError(
        'The uploaded xml file is not valid',
      );

    const meetings = Array.isArray(meeting) ? meeting : [meeting];

    const meetingModels: MeetingModel[] = [];
    if (!meetings || !Array.isArray(meetings)) {
      return meetingModels;
    }
    for (const { meeting } of meetings) {
      const datetime = new Date(meeting.datetime);
      const personToMeet = meeting.personToMeet;
      const meetingPoint = meeting.meetingPoint;
      meetingModels.push(
        new MeetingModel(datetime, personToMeet, meetingPoint),
      );
    }

    return meetingModels;
  }

  public async getMeetingsByDate(date: Date): Promise<MeetingModel[]> {
    const filePath = path.join(this.dataDirPath, this.dataFileName);
    const { mtime } = await fsp.stat(filePath);

    if (!this.meetings || mtime.getTime() !== this.lastFileUpdate?.getTime()) {
      this.meetings = await this.getAllMeetings();
      this.lastFileUpdate = mtime;
    }

    return this.meetings.filter(
      (meeting) => meeting.datetime.getDate() === date.getDate(),
    );
  }
}

export class XmlDataFileIsNotValidError extends ApplicationError {}
