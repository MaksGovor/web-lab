import * as fsp from 'fs/promises';
import * as xmlDom from 'xmldom';
import { Injectable } from '@nestjs/common';

@Injectable()
export class XmlToObjectConverter {
  public async convertXmlToObject(filename: string): Promise<any> {
    try {
      const xmlString = await fsp.readFile(filename, 'utf8');
      const parser = new xmlDom.DOMParser();
      const doc = parser.parseFromString(xmlString, 'text/xml');
      return this.parseNode(doc.documentElement);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private parseNode(node: Element): any {
    const obj: any = {};
    const nodeName = node.nodeName;

    if (
      node.childNodes.length === 1 &&
      node.childNodes[0].nodeType === node.TEXT_NODE
    ) {
      return node.childNodes[0].nodeValue?.trim();
    }

    if (node.attributes.length > 0) {
      obj[nodeName] = {
        attributes: {},
      };

      for (let i = 0; i < node.attributes.length; i++) {
        const attr = node.attributes[i];
        obj[nodeName].attributes[attr.nodeName] = attr.nodeValue;
      }
    } else {
      obj[nodeName] = {};
    }

    for (let i = 0; i < node.childNodes.length; i++) {
      const childNode = node.childNodes[i];
      if (childNode.nodeType === node.ELEMENT_NODE) {
        const childObject = this.parseNode(childNode as Element);
        const childNodeName = childNode.nodeName;
        if (Array.isArray(obj[nodeName][childNodeName])) {
          obj[nodeName][childNodeName].push(childObject);
        } else if (obj[nodeName][childNodeName]) {
          obj[nodeName][childNodeName] = [
            obj[nodeName][childNodeName],
            childObject,
          ];
        } else {
          obj[nodeName][childNodeName] = childObject;
        }
      }
    }

    return obj;
  }
}
