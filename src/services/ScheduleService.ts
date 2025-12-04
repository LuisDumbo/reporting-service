import cron from "node-cron";

export class ScheduleService {
    private static instance: ScheduleService;

    private constructor() { }

    static getInstance(): ScheduleService {
        if (!ScheduleService.instance) {
            ScheduleService.instance = new ScheduleService();
        }
        return ScheduleService.instance;
    }

    /**
     * Agenda uma tarefa com cron
     * @param cronTime string no formato cron (ex: '* * * * *')
     * @param task função que será executada
     */
    scheduleTask(cronTime: string, task: () => void) {
        cron.schedule(cronTime, task);
        console.log(`🕒 Tarefa agendada: ${cronTime} (horário local do servidor)`);
    }
}
