import type { ITrebllePayload } from "../types/trebllePayload.types";

/**
 * Send the data to treblle so that it can be recorded
 * @param payload Payload to send to treblle
 */
export default async function sendPayload(
  payload: ITrebllePayload,
  apiKey: string
) {
  try {
    fetch("https://rocknrolla.treblle.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Treblle.js] - Unable to send data to treblle\n");
    console.error(error);
  }
}
