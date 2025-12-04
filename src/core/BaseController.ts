import { Request, Response } from "express";

export abstract class BaseController {
    abstract getAll(req: Request, res: Response): Promise<any>;
    abstract create(req: Request, res: Response): Promise<any>;
}
