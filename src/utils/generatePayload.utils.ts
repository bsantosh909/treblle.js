import os from "os";

//
import { version, name } from "../../package.json";

//
import type { ITrebllePayload } from "../types/trebllePayload.types";

//
interface IGeneratePayloadOptions {
  apiKey: string;
  projectId: string;
  ip: string;
  protocol: string;
  url: string;
  request: {
    userAgent: string;
    method: string;
    headers: object;
    body: object | null;
  };
  reponse: {
    headers: object;
    body: object | null;
    statusCode: number;
    size: number | string;
    loadTime: number;
  };
  errors: {
    source: string;
    type: string;
    message: string;
    file: string;
    line: string;
  }[];
}

/**
 *
 */
export default function generatePayload(
  options: IGeneratePayloadOptions
): ITrebllePayload {
  return {
    api_key: options.apiKey,
    project_id: options.projectId,
    sdk: name,
    version: `v${version}`,
    data: {
      server: {
        ip: options.ip,
        protocol: options.protocol,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        software: null, // TODO
        signature: null, // TODO
        encoding: "", // TODO
        os: {
          name: os.platform(),
          release: os.release(),
          architecture: os.arch(),
        },
      },
      language: {
        name: "Node.js",
        version: process.version,
        expose_php: "", // Not necessary for Node.js
        display_errors: "", // TODO
      },
      request: {
        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
        ip: options.ip,
        url: options.url,
        user_agent: options.request.userAgent,
        method: options.request.method,
        headers: options.request.headers,
        body: options.request.body,
      },
      response: {
        headers: options.reponse.headers,
        code: options.reponse.statusCode,
        size: options.reponse.size,
        load_time: options.reponse.loadTime,
        body: options.reponse.body,
      },
      errors: options.errors,
    },
  };
}
