export interface ITrebllePayload {
  api_key: string;
  project_id: string;
  sdk: string;
  version: string | number;
  data: {
    server: IServerPayload;
    language: ILanguagePayload;
    request: IRequestPayload;
    response: IResponsePayload;
    errors: Object[];
  };
}

export interface ILanguagePayload {
  name: string;
  version: string;
  expose_php?: string; // Not required for Node.js
  display_errors?: string; // Not sure about this
}

export interface IServerPayload {
  ip: string;
  protocol: string;
  timezone: string;
  software: null; // TODO
  signature: null; // TODO
  encoding: string; // TODO
  os: {
    name: string;
    release: string;
    architecture: string;
  };
}

export interface IResponsePayload {
  headers: Object;
  code: number | string;
  size: number | string;
  load_time: number;
  body: Object | null;
}

export interface IRequestPayload {
  ip: string;
  url: string;
  timestamp: string;
  user_agent: string;
  method: string;
  headers: Object;
  body: Object | null;
}
