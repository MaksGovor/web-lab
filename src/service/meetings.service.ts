import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import * as fsp from 'node:fs/promises';
import { MeetingsBodyRequest } from 'dto/request.dto';
import { Builder } from 'xml2js';

@Injectable()
export class MeetingsService {
  private readonly dataDirPath: string;
  private readonly dataFileName: string;

  constructor(private readonly configService: ConfigService) {
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
}
