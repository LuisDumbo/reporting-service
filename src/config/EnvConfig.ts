import dotenv from "dotenv";
dotenv.config();

export class EnvConfig {
    static get(key: string, defaultValue?: string): string {
        return process.env[key] || defaultValue || "";
    }

    static getNumber(key: string, defaultValue?: number): number {
        const value = process.env[key];
        return value ? Number(value) : Number(defaultValue);
    }

    static get HOST(): string {
        return this.get("HOST", "127.0.0.1");
    }

    static get PORT(): number {
        return this.getNumber("PORT", 3000);
    }

    static get APP_NAME(): string {
        return this.get("APP_NAME", "reporting-service");
    }
}
