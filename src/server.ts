import app from "./app";
import { EnvConfig } from "./config/EnvConfig";
import { ReportScheduler } from "./schedules/ReportScheduler";

// Inicializa scheduler
new ReportScheduler();

const PORT = EnvConfig.PORT;
const HOST = EnvConfig.HOST;

app.listen(PORT, HOST, () => {
    console.log(`🚀 ${EnvConfig.APP_NAME} rodando em http://${HOST}:${PORT}`);
});
