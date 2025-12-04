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

    excelToStructuredJson(buffer: Buffer, ano: number, trimestre: number) {
        const workbook = XLSX.read(buffer, { type: "buffer" });

        const result: any = {
            ano,
            trimestre
        };

        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            if (!sheet) return;

            let rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });

            if (!rows.length) {
                result[sheetName] = [];
                return;
            }

            const columns = Object.keys(rows[0] || {});
            this.validator.validateColumns(columns);

            rows = rows.map(row => this.cleanRow(row));

            rows.forEach((row, index) => {
                this.validator.validateRowTypes(row, index);
            });

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
