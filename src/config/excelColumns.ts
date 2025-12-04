export interface ColumnDefinition {
    name: string;
    type: "string" | "number";
    required: boolean;
}

export const REQUIRED_COLUMNS: ColumnDefinition[] = [
    { name: "num_conta", type: "string", required: true },
    { name: "conta_principal", type: "string", required: true },
    { name: "num_subconta", type: "string", required: true },
    { name: "subconta", type: "string", required: true },
    { name: "num_conta_movimento", type: "string", required: true },
    { name: "nome_conta", type: "string", required: true },
    { name: "debito", type: "number", required: true },
    { name: "credito", type: "number", required: true },
    { name: "saldo", type: "number", required: true }
];
