import "dotenv/config";

//
import useKoaMiddleware from "./libs/koa";
import useExpressMiddleware from "./libs/express";

// Named export
export const useTreblleKoa = useKoaMiddleware;
export const useTreblleExpress = useExpressMiddleware;

// Default export
export default {
  useTreblleKoa: useKoaMiddleware,
  useTreblleExpress: useExpressMiddleware,
};
