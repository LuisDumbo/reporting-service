import * as XLSX from "xlsx";
import { ExcelValidatorService } from "./ExcelValidatorService";

export class ExcelService {
    private static instance: ExcelService;
    private validator = new ExcelValidatorService();

    static getInstance(): ExcelService {
        if (!ExcelService.instance) {
            ExcelService.instance = new ExcelService();
        }
        return ExcelService.instance;
    }

    excelToStructuredJson(filePath: string, ano: number, trimestre: number) {
        const workbook = XLSX.readFile(filePath);

        // Objeto base com ano e trimestre
        const result: any = {
            ano,
            trimestre
        };

        // Percorre todas as abas do ficheiro
        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) return;

            let rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

            // Se a aba estiver vazia, ainda assim criamos a propriedade como array vazio
            if (!rows.length) {
                result[sheetName] = [];
                return;
            }

            // Validação de colunas para esta aba
            const columns = Object.keys(rows[0] || {});
            this.validator.validateColumns(columns);

            // Limpa colunas __EMPTY
            rows = rows.map(row => this.cleanRow(row));

            // Validação de tipos linha a linha
            rows.forEach((row, index) => {
                this.validator.validateRowTypes(row, index);
            });

            // Estrutura final dessa aba (ex.: result["activos"], result["passivos"], etc.)
            result[sheetName] = rows.map(row => this.structureRow(row));
        });

        return result;
    }

    private cleanRow(row: any) {
        Object.keys(row).forEach(key => {
            if (key.startsWith("__EMPTY")) delete row[key];
        });
        return row;
    }

    private structureRow(row: any) {
        return {
            num_conta: row["num_conta"],
            conta_principal: row["conta_principal"],
            num_subconta: row["num_subconta"],
            subconta: row["subconta"],
            num_conta_movimento: row["num_conta_movimento"],
            nome_conta: row["nome_conta"],
            debito: Number(row["debito"]) || 0,
            credito: Number(row["credito"]) || 0,
            saldo: Number(row["saldo"]) || 0
        };
    }
}
