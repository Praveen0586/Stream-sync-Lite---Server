import express, { Request, Response } from "express";
import application from "./app";



const app = express();
const PORT = 3000;
app.use(express.json());
app.use("/", application);
app.get("/", (req: Request, res: Response) => {
  res.send("🚀 TypeScript Node Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
