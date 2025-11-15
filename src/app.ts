import express, { type Request, type Response } from "express";

class App{
  private app: express.Application;

  constructor(){
    this.app = express();
    this.routes();
  }

  private routes():void{
    this.app.get("/", (req: Request, res: Response) => {
      res.json({ message: "Hello World" });
    });
  }

  getApp = () => this.app;
}

export default new App().getApp();