import type { ITrebllePayload } from "../types/trebllePayload.types";

/**
 * List of valid endpoints to send request to
 */
const validTreblleEndpoints = [
  "https://rocknrolla.treblle.com",
  "https://punisher.treblle.com",
  "https://sicario.treblle.com",
];

//
const debugEndpoint = "https://debug.treblle.com";

//
let activeEndpointIndex = 0;

/**
 * Send the data to treblle so that it can be recorded
 * @param payload Payload to send to treblle
 */
export default async function sendPayload(
  payload: ITrebllePayload,
  apiKey: string,
  debugMode?: boolean
) {
  try {
    const endpointToHit = debugMode
      ? debugEndpoint
      : validTreblleEndpoints[activeEndpointIndex];

    // Sending the data to treblle
    fetch(endpointToHit, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    // Updating active endpoint index
    if (!debugEndpoint) {
      activeEndpointIndex = (activeEndpointIndex + 1) % 3;
    }
  } catch (error) {
    console.error("Treblle.js] - Unable to send data to treblle\n");
    console.error(error);
  }
}
