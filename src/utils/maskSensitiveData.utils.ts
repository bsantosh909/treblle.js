// Ref: https://docs.treblle.com/en/security/masked-fields#fields-masked-by-default
const defaultMaskKeys: string[] = [
    "password",
    "pwd",
    "secret",
    "password_confirmation",
    "passwordConfirmation",
    "cc",
    "card_number",
    "cardNumber",
    "ccv",
    "ssn",
    "credit_score",
    "creditScore",
    "api_key",
    // Custom additons
    "authorization",
    "x-api-key",
  ];
  
  // Substrings which should not be masked
  const safeWords: string[] = ["bearer", "basic"];
  
  /**
   * Mask the specific data for secure keys.
   *
   * The following keys [mentioned here](https://docs.treblle.com/en/security/masked-fields#fields-masked-by-default) are masked by default so you don't have to pass these
   *
   * @param data Object in which we need to mask the data
   * @param keys keys which should be masked
   */
  export default function maskSensitiveData(
    data: { [x: string]: any },
    keys?: string[]
  ) {
    if (!data) return {};
    if (typeof data !== "object") return data;
  
    const keysList = [...defaultMaskKeys, ...(keys ?? [])];
    const keysListToMask = [...new Set(keysList)].map((key) => key.toLowerCase());
  
    //
    const allObjectKeys = Object.keys(data);
    const dataToEdit = JSON.parse(JSON.stringify(data));
  
    //
    let maskedObject: { [x: string]: any } = {};
  
    //
    for (const key of allObjectKeys) {
      const dataForKey = dataToEdit[key];
  
      //
      if (Array.isArray(dataForKey)) {
        maskedObject[key] = dataForKey.map((dataItem) =>
          maskSensitiveData(dataItem, keys)
        );
      } else if (typeof dataForKey === "object") {
        maskedObject[key] = maskSensitiveData(dataForKey, keys);
      } else if (
        typeof dataForKey === "string" &&
        keysListToMask.includes(key.toLowerCase())
      ) {
        maskedObject[key] = maskString(dataForKey);
      } else {
        maskedObject[key] = dataForKey;
      }
    }
  
    //
    return maskedObject;
  }
  
  /**
   * Mask the string and return masked value
   * @param inputString Input to mask
   */
  function maskString(inputString: string) {
    // Split the input string into an array of words
    let words = inputString.split(/\s+/);
  
    // Create a new array where each word is replaced by asterisks if it's not a safe word
    let maskedWords = words.map((word) =>
      safeWords.includes(word.toLowerCase()) ? word : "*".repeat(word.length)
    );
  
    // Join the masked words back into a string
    let maskedString = maskedWords.join(" ");
  
    return maskedString;
  }
  