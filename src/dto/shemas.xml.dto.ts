export const MeetingsRequestBodyXmlSchema = {
  type: 'array',
  xml: {
    name: 'meetings',
    wrapped: true,
  },
  items: {
    xml: {
      name: 'meeting',
    },
    type: 'object',
    properties: {
      datetime: { type: 'string', attribute: 'string' },
      personToMeet: { type: 'string' },
      meetingPoint: { type: 'string' },
    },
  },
};

export const MeetingsRequestBodyXmlFileSchema = {
  type: 'object',
  properties: {
    file: {
      type: 'string',
      format: 'binary',
    },
  },
};
