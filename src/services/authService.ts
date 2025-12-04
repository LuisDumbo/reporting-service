import axios from "axios";
import { TokenManager } from "../utils/tokenManager";

let failedAttempts = 0;
let sessions = 0;
let lockUntil = 0;

export async function login() {
    const now = Date.now();

    if (failedAttempts >= 3 && now < lockUntil) {
        throw new Error("Conta temporariamente bloqueada. Tente novamente mais tarde.");
    }

    const MAX_SESSIONS = 3;
    if (sessions >= MAX_SESSIONS && now < lockUntil) {
        throw new Error("Limite de sessões atingido. Aguarde 5 minutos.");
    }

    try {
        const response = await axios.post("https://reporteshml.cmc.ao/auth/login", {
            email: "suporte.fundos@bns.ao",
            password: "3NSLk#@2025",
        });

        const token = response.data.token;

        TokenManager.setToken(token);
        failedAttempts = 0;
        sessions++;

        return token;

    } catch (error) {
        failedAttempts++;

        if (failedAttempts >= 3) {
            lockUntil = Date.now() + 5 * 60 * 1000; // bloqueia 5 min
        }

        console.log(error);


        throw new Error("Credenciais inválidas.");
    }
}
