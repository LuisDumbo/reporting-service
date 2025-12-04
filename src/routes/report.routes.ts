import { Router } from "express";
import { ReportController } from "../controllers/ReportController";

const router = Router();
const controller = new ReportController();


router.get("/", (req, res) => controller.getAll(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.get("/teste/:id/:nome", (req, res) => controller.teste(req, res));



export default router;
