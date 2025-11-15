import express, { type Request, type Response } from "express";


const app = express();

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World" });
});

export default app;