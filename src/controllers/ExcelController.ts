import { Request, Response } from "express";
import { ExcelService } from "../services/ExcelService";
import fs from "fs";
import path from "path";
import axios from "axios";

export class ExcelController {
    private excelService = ExcelService.getInstance();

    async uploadExcel(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "Nenhum arquivo enviado." });
            }

            const { ano, trimestre } = req.body;

            const filePath = req.file.buffer;;

            const finalJson = this.excelService.excelToStructuredJson(
                filePath,
                Number(ano),
                Number(trimestre)
            );




            const response = await axios.post(
                "https://reporteshml.cmc.ao/api/reportes/balancete",
                finalJson,
                {
                    headers: {
                        Authorization: req.headers.Authorization,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Resposta da api" + response);



            /*    const outputDir = path.join(__dirname, "../../uploads/json");
                if (!fs.existsSync(outputDir)) {
                    fs.mkdirSync(outputDir, { recursive: true });
                } 
    
                const outputFile = path.join(outputDir, `balancete_${Date.now()}.json`);
                fs.writeFileSync(outputFile, JSON.stringify(finalJson, null, 2)); */

            return res.status(200).json({
                success: true,
                message: "Excel processado e estruturado com sucesso!",
                saved_to: "",
                data: finalJson
            });

        } catch (err: any) {

            console.log(err);


            if (err.response?.status === 400) {
                return res.status(400).json({
                    success: false,
                    message: 'Balancete mal formatado. Verifique os dados e tente novamente.',
                });
            }

            return res.status(400).json({
                success: false,
                error: err.response.data.mensagem || "Erro ao processar o arquivo Excel."
                ,
            });
        }
    }

    async updateExcel(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ error: "Nenhum arquivo enviado." });
            }

            const { ano, trimestre } = req.body;

            const filePath = req.file.buffer;;

            const finalJson = this.excelService.excelToStructuredJson(
                filePath,
                Number(ano),
                Number(trimestre)
            );


            console.log(req.headers.Authorization);


            const response = await axios.post(
                "https://reporteshml.cmc.ao/api/reportes/balancete/updateBalancete",
                finalJson,
                {
                    headers: {
                        Authorization: req.headers.Authorization,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Resposta da api" + response);



            /*   const outputDir = path.join(__dirname, "../../uploads/json");
               if (!fs.existsSync(outputDir)) {
                   fs.mkdirSync(outputDir, { recursive: true });
               }
   
               const outputFile = path.join(outputDir, `balancete_${Date.now()}.json`);
               fs.writeFileSync(outputFile, JSON.stringify(finalJson, null, 2));*/

            return res.status(200).json({
                success: true,
                message: "Excel processado e estruturado com sucesso!",
                saved_to: "",
                data: finalJson
            });

        } catch (err: any) {
            console.error('AXIOS ERROR:', {
                status: err.response?.status,
                message: err.message,
            });

            // ⏱ Timeout / Gateway
            if (err.response?.status === 504) {
                return res.status(504).json({
                    success: false,
                    message: 'O servidor demorou demasiado a responder. Tente novamente em instantes.',
                });
            }

            // ❌ Sem resposta (queda de rede, DNS, etc)
            if (!err.response) {
                return res.status(503).json({
                    success: false,
                    message: 'Serviço temporariamente indisponível.',
                });
            }

            // ⚠️ Outros erros da API
            return res.status(err.response.status).json({
                success: false,
                message:
                    err.response.data?.mensagem ||
                    'Erro ao processar a requisição.',
            });
        }

    }
}
