import { BaseModel } from "../core/BaseModel";

export interface Report {
    id: number;
    title: string;
    period: string;
}

export class ReportModel extends BaseModel<Report> {
    private static instance: ReportModel;

    private constructor() {
        super();
    }

    static getInstance(): ReportModel {
        if (!ReportModel.instance) {
            ReportModel.instance = new ReportModel();
        }
        return ReportModel.instance;
    }

    createReport(title: string, period: string): Report {
        const report: Report = {
            id: this.items.length + 1,
            title,
            period
        };
        return this.create(report);
    }
}
