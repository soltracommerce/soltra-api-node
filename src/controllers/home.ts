import { Request, Response, NextFunction } from "express";

const appController = (req: Request, res: Response, next: NextFunction) => {
  res.send(`
    <h2>WELCOME TO THE MARKET PLACE</h2>
    <p>Check Documentation for more info</p>.
    `);
};

export default appController;
