// src/controllers/BalanceteController.ts
import { Request, Response } from "express";
import { BalanceteExcelService } from "../services/BalanceteExcelService";

const balanceteExcelService = new BalanceteExcelService();

export class BalanceteController {
    /**
     * GET /balancete/excel?ano=2024&trimestre=2&entidade_id=3
     * Vai à API buscar o balancete e devolve um ficheiro Excel.
     */
    async exportBalanceteExcel(req: Request, res: Response) {
        try {
            const { ano, trimestre } = req.params;

            console.log(ano, trimestre);



            // URL da API que devolve o JSON do balancete
            // (coloca aqui a URL real da tua API)
            const apiUrl = `https://reporteshml.cmc.ao/api/reportes/balancete/${ano}/${trimestre}` //process.env.BALANCETE_API_URL as string;

            if (!apiUrl) {
                return res
                    .status(500)
                    .json({ erro: "BALANCETE_API_URL não configurada." });
            }

            // Se quiseres passar o token que chega no request
            const authorizationHeader = req.headers.Authorization; // já vem com Bearer xxx




            const apiResponse = await balanceteExcelService.fetchBalancete(
                apiUrl,
                authorizationHeader
            );



            if (!apiResponse.sucesso || !apiResponse.dados?.length) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem:
                        "Não foi encontrado nenhum balancete na resposta da API.",
                });
            }

            // Escolher o item certo em função de ano / trimestre / entidade_id
            const item = apiResponse.dados.find((d) => {
                const matchAno =
                    !ano || Number(ano) === Number(d.ano);
                const matchTrim =
                    !trimestre || Number(trimestre) === Number(d.trimestre);
                return matchAno && matchTrim;
            });

            if (!item) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem:
                        "Não foi encontrado balancete para os parâmetros informados.",
                });
            }

            const workbook = balanceteExcelService.buildWorkbookFromBalancete(item);
            const buffer = balanceteExcelService.workbookToBuffer(workbook);

            const filename = `balancete_${item.ano}_T${item.trimestre}_ent${item.entidade_id}.xlsx`;

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${filename}"`
            );

            return res.send(buffer);

        } catch (error: any) {
            console.error("Erro ao exportar balancete para Excel:", error);
            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro interno ao gerar ficheiro Excel.",
                detalhes: error?.message,
            });
        }
    }
}
