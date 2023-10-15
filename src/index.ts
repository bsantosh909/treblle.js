import "dotenv/config";

//
import useExpressMiddleware from "./libs/express";

// Named export
export const useExpress = useExpressMiddleware;

// Default export
export default {
  useExpress: useExpressMiddleware,
};
