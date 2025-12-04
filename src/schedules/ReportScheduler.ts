import { ScheduleService } from "../services/ScheduleService";

export class ReportScheduler {
    private scheduleService = ScheduleService.getInstance();

    constructor() {
        this.init();
    }

    private init() {
        // Exemplo: roda todo dia às 08:00 UTC
        this.scheduleService.scheduleTask("0 8 * * *", this.generateDailyReport);
    }

    private generateDailyReport() {
        console.log("📊 Gerando relatório diário...");
        // Aqui pode chamar serviços que geram/mandam o relatório
        // Exemplo:
        // ReportService.getInstance().generateDailyReport();
    }
}
