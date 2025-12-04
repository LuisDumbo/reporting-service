import { Request, Response } from "express";
import { BaseController } from "../core/BaseController";
import { ReportModel } from "../models/ReportModel";

export class ReportController extends BaseController {
    private reportModel = ReportModel.getInstance();

    async getAll(req: Request, res: Response) {
        const reports = this.reportModel.findAll();
        return res.json({ success: true, data: reports });
    }

    async create(req: Request, res: Response) {
        const { title, period } = req.body;

        const newReport = this.reportModel.createReport(title, period);

        return res.status(201).json({
            success: true,
            message: "Report criado com sucesso",
            data: newReport
        });
    }

    async teste(req: Request, res: Response) {

        console.log("Conectou");

        const { id, nome } = req.params;

        return res.status(200).json({
            success: true,
            message: `Teste bem sucedido para o ID: ${id} e Nome: ${nome}`
        });

    }
}
