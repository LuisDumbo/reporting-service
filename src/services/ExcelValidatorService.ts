import fs from "fs";
import path from "path";
import { REQUIRED_COLUMNS } from "../config/excelColumns";

export class ExcelValidatorService {

    validateColumns(columns: string[]) {
        const missing = REQUIRED_COLUMNS
            .filter(col => col.required && !columns.includes(col.name))
            .map(c => c.name);

        if (missing.length > 0) {
            const errorMessage = `❌ ERRO: Colunas em falta → ${missing.join(", ")}`;
            this.writeLog(errorMessage);
            throw new Error(errorMessage);
        }
    }

    validateRowTypes(row: any, index: number) {
        for (const col of REQUIRED_COLUMNS) {
            const value = row[col.name];

            // Validação por tipo
            if (col.type === "string") {
                if (value === null || value === undefined || value === "") {
                    this.throwRowError(index, col.name, "string", value);
                }
                if (typeof value !== "string") {
                    this.throwRowError(index, col.name, "string", typeof value);
                }
            }

            if (col.type === "number") {
                if (value === null || value === undefined) {
                    this.throwRowError(index, col.name, "number", value);
                }

                const num = Number(value);
                if (isNaN(num)) {
                    this.throwRowError(index, col.name, "number", value);
                }
            }
        }
    }

    private throwRowError(rowIndex: number, col: string, expected: string, received: any) {
        const errorMessage = `❌ ERRO NA LINHA ${rowIndex + 1}: coluna "${col}" deveria ser ${expected}, recebeu "${received}"`;
        this.writeLog(errorMessage);
        throw new Error(errorMessage);
    }

    private writeLog(message: string) {
        const logDir = path.join(__dirname, "../../logs");

        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const logFile = path.join(logDir, "excel_errors.log");
        const fullMessage = `[${new Date().toISOString()}] ${message}\n`;

        fs.appendFileSync(logFile, fullMessage, "utf-8");
        console.error(fullMessage);
    }
}
