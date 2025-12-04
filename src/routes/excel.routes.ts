import { Router } from "express";
import multer from "multer";
import { ExcelController } from "../controllers/ExcelController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { BalanceteController } from "../controllers/BalanceteController";

const router = Router();
const controller = new ExcelController();
const balanceteController = new BalanceteController();

// Configuração do multer
const upload = multer({ dest: "uploads/" });

// Rota POST para upload do Excel
router.post("/upload", authMiddleware, upload.single("file"), (req, res) => controller.uploadExcel(req, res));

// Rota POST para upload do Excel
router.put("/upload-update", authMiddleware, upload.single("file"), (req, res) => controller.updateExcel(req, res));

router.get("/balancete/excel/:ano/:trimestre", authMiddleware, (req, res) =>
    balanceteController.exportBalanceteExcel(req, res)
);


export default router;
