import * as util from 'node:util';
import { parseString } from 'xml2js';

export const parseXmlStringPromise = util.promisify(parseString);
