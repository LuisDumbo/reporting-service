// src/services/BalanceteExcelService.ts
import axios from "axios";
import * as XLSX from "xlsx";

export interface Movimento {
    num_conta: string;
    conta_principal: string;
    num_subconta: string;
    subconta: string;
    num_conta_movimento: string;
    nome_conta: string;
    debito: number;
    credito: number;
    saldo: number;
}

export interface BalanceteApiResponse {
    sucesso: boolean;
    mensagem: string;
    dados: BalanceteItem[];
}

export interface BalanceteItem {
    ano: number;
    trimestre: number;
    entidade_id: number;
    // O resto são secções como "activos", "passivos", "compensacaoActiva", etc.
    [secao: string]: any;
}

export class BalanceteExcelService {
    /**
     * Vai buscar os dados à API remota.
     */
    async fetchBalancete(
        url: string,
        token?: string | string[] | undefined
    ): Promise<BalanceteApiResponse> {
        const response = await axios.get<BalanceteApiResponse>(url, {
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    }

    /**
     * A partir de um BalanceteItem constrói um workbook XLSX
     * com uma aba por cada secção (activos, passivos, etc.).
     */
    buildWorkbookFromBalancete(item: BalanceteItem): XLSX.WorkBook {
        const workbook = XLSX.utils.book_new();

        // Propriedades que NÃO são abas
        const camposMeta = ["ano", "trimestre", "entidade_id"];

        // Percorremos todas as chaves do item
        Object.keys(item).forEach((key) => {
            if (camposMeta.includes(key)) return;

            const valor = item[key];

            // Só criamos aba para arrays (ex.: activos, passivos, compensacaoActiva…)
            if (!Array.isArray(valor) || valor.length === 0) {
                return;
            }

            const movimentos: Movimento[] = valor;

            // Cabeçalho das colunas
            const header = [
                "num_conta",
                "conta_principal",
                "num_subconta",
                "subconta",
                "num_conta_movimento",
                "nome_conta",
                "debito",
                "credito",
                "saldo",
            ];

            const data = [
                header,
                ...movimentos.map((m) => [
                    m.num_conta,
                    m.conta_principal,
                    m.num_subconta,
                    m.subconta,
                    m.num_conta_movimento,
                    m.nome_conta,
                    m.debito,
                    m.credito,
                    m.saldo,
                ]),
            ];

            const worksheet = XLSX.utils.aoa_to_sheet(data);

            // Nome da aba (máximo 31 chars, sem caracteres inválidos)
            const sheetName = this.normalizeSheetName(key);

            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });

        return workbook;
    }

    /**
     * Converte o workbook num Buffer para envio via HTTP.
     */
    workbookToBuffer(workbook: XLSX.WorkBook): Buffer {
        return XLSX.write(workbook, {
            bookType: "xlsx",
            type: "buffer",
        }) as Buffer;
    }

    /**
     * Opcional: normalizar nome da aba para evitar problemas com Excel.
     */
    private normalizeSheetName(name: string): string {
        // Remove caracteres inválidos para nomes de folhas no Excel
        let normalized = name.replace(/[:\\/?*\[\]]/g, " ");
        // Limita a 31 caracteres
        if (normalized.length > 31) {
            normalized = normalized.substring(0, 31);
        }
        // Garante que não fica vazio
        if (!normalized.trim()) {
            normalized = "Sheet";
        }
        return normalized;
    }
}
