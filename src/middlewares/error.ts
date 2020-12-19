import { Response, NextFunction } from "express";
import colors from "colors/safe";
import logger from "../startup/logger";

const error = (err: Error, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
  logger.error(colors.red(`Express server error: ${err.message}`), err);
};

export default error;
