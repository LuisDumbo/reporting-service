// src/utils/tokenManager.ts
export class TokenManager {
    private static token: string | null = null;
    private static expiresAt: number | null = null;

    static setToken(token: string) {
        this.token = token;
        // expira em 15 min
        this.expiresAt = Date.now() + 15 * 60 * 1000;
    }

    static isExpired(): boolean {
        if (!this.token || !this.expiresAt) return true;
        return Date.now() >= this.expiresAt;
    }

    static getToken(): string | null {
        return this.token;
    }

    static clear() {
        this.token = null;
        this.expiresAt = null;
    }
}
