import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import * as fsp from 'node:fs/promises';
import { MeetingsBodyRequest } from 'dto/request.dto';
import { Builder } from 'xml2js';
import { MeetingModel } from 'model/meeting.model';
import { XmlToObjectConverter } from 'util/xml-to-model';

@Injectable()
export class MeetingsService {
  private readonly dataDirPath: string;
  private readonly dataFileName: string;

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

  public async getMeetingsByDate(): Promise<MeetingModel[]> {
    const filePath = path.join(this.dataDirPath, this.dataFileName);

    const meetings = await this.xmlToObjectConverter.convertXmlToObject(
      filePath,
    );
    console.dir(meetings, { depth: 10 });
    return [];
  }
}
