import express from "express";
import cors from "cors";
import { Request, Response } from "express";
import reportRoutes from "./routes/report.routes";
import excelRoutes from "./routes/excel.routes";

const app = express();

app.use(cors());


app.use(express.json());
app.use("/", (req: Request, res: Response) => {
    res.send("API is running");
})
app.use("/api/reports", reportRoutes);
app.use("/api/excel", excelRoutes);

export default app;
