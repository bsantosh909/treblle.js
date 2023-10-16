import { Context, Next } from "koa";

//
import sendPayload from "../utils/sendPayload.utils";
import generatePayload from "../utils/generatePayload.utils";
import maskSensitiveData from "../utils/maskSensitiveData.utils";
import getRequestDuration from "../utils/getRequestDuration.utils";

//
import type { ITreblleOptions } from "../types/treblle.types";

/**
 *
 */
export default function treblle(options?: ITreblleOptions) {
  // Checking if API key is provided or not
  const apiKey = options?.apiKey ?? process.env.TREBLLE_API_KEY;
  if (!apiKey) {
    console.warn(
      "[Treblle.js] WARNING - Unable to connect to Treblle, missing apiKey!"
    );
  }

  // Checking if Project ID is provided or not
  const projectId = options?.projectId ?? process.env.TREBLLE_PROJECT_ID;
  if (!projectId) {
    console.warn(
      "[Treblle.js] WARNING - Unable to connect to Treblle, missing projectId!"
    );
  }

  /**
   *
   */
  return async function koaMiddleware(ctx: Context, next: Next) {
    if (!apiKey || !projectId) {
      return next();
    }

    //
    const maskingKeys = options?.maskingKeys ?? [];

    //
    const excludedMethods =
      options?.excludeMethod?.map((metohd) => metohd.toUpperCase()) ?? [];

    // Checking if request method is excluded from tracking
    if (excludedMethods.includes(ctx.request.method)) {
      return next();
    }

    // Tracking the start tiem for the request
    const requestStartTime = process.hrtime();

    // Letting Koa do it's work
    await next();

    // Getting the complete URL for the request
    const completeUrl = `${ctx.request.protocol}://${ctx.request.hostname}${ctx.request.originalUrl}`;

    //
    const requestBody = ctx.request.body ?? {};
    const requestQuery = ctx.query ?? {};

    const requestBodyPayload = { ...requestBody, ...requestQuery };
    const responseBodyPayload = ctx.response.body ?? {};

    //
    const trebllePayload = generatePayload({
      apiKey,
      projectId,
      ip: ctx.request.ip,
      url: completeUrl,
      protocol: ctx.request.protocol,
      request: {
        body: maskSensitiveData(requestBodyPayload, maskingKeys),
        headers: maskSensitiveData(ctx.request.headers, maskingKeys),
        method: ctx.request.method,
        userAgent: ctx.headers["user-agent"] ?? "",
      },
      reponse: {
        body: maskSensitiveData(responseBodyPayload, maskingKeys),
        headers: maskSensitiveData(ctx.response.headers, maskingKeys),
        loadTime: getRequestDuration(requestStartTime),
        size: ctx.length,
        statusCode: ctx.status,
      },
      errors: [],
    });

    // Sending data to treblle
    sendPayload(trebllePayload, apiKey);
  };
}
