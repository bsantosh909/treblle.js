import type { Request, Response, NextFunction } from "express";

//
import sendPayload from "../utils/sendPayload.utils";
import generatePayload from "../utils/generatePayload.utils";
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
  return function expressMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!apiKey || !projectId) {
      return next();
    }

    // Tracking the start tiem for the request
    const requestStartTime = process.hrtime();

    // The reponse body coming from the API
    let responseBody = "{}";

    // Getting the complete URL for the request
    const completeUrl = `${req.protocol}://${req.hostname}${req.originalUrl}`;

    //
    const originalSend = res.send;

    //
    res.send = function testSomething(body) {
      originalSend.call(this, body);

      // Storing the body response
      responseBody = body
        ? typeof body === "string"
          ? body
          : JSON.stringify(body)
        : "{}";

      return this;
    };

    //
    res.on("finish", () => {
      const requestBody = req.body ?? {};
      const requestQuery = req.query ?? {};

      const requestBodyPayload = { ...requestBody, ...requestQuery };

      //
      const trebllePayload = generatePayload({
        apiKey,
        projectId,
        ip: req.ip,
        url: completeUrl,
        protocol: req.protocol,
        request: {
          body: requestBodyPayload,
          headers: req.headers,
          method: req.method,
          userAgent: req.headers["user-agent"] ?? "",
        },
        reponse: {
          body: JSON.parse(responseBody ?? "{}"),
          headers: res.getHeaders(),
          loadTime: getRequestDuration(requestStartTime),
          size: res.get("content-length") ?? "",
          statusCode: res.statusCode,
        },
        errors: [],
      });

      //
      sendPayload(trebllePayload, apiKey);
    });

    // Everything is alright, let's proceed
    next();
  };
}
