import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.simple(), format.colorize()),
  transports: [new transports.Console()],
});

export default logger;