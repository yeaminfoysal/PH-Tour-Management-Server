import { NextFunction, Request, Response } from "express";
import { DivisionService } from "./division.services";
// import { DivisionService } from "./division.service";

const createDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await DivisionService.createDivision(req.body);
        res.status(201).json({
            success: true,
            message: "Division created",
            data: result
        })
    } catch (error) {
        next(error)
    }
};

const getAllDivisions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await DivisionService.getAllDivisions();
        res.status(200).json({
            success: true,
            message: "Divisions retrieved",
            data: result.data,
            meta: result.meta
        })
    } catch (error) {
        next(error)
    }
};
const getSingleDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slug = req.params.slug
        const result = await DivisionService.getSingleDivision(slug);
        res.status(200).json({
            success: true,
            message: "Division retrieved",
            data: result.data
        })
    } catch (error) {
        next(error)
    }
};

const updateDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        const result = await DivisionService.updateDivision(id, req.body);
        res.status(200).json({
            success: true,
            message: "Division updated",
            data: result,
        })
    } catch (error) {
        next(error)
    }
};

const deleteDivision = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await DivisionService.deleteDivision(req.params.id);
        res.status(200).json({
            success: true,
            message: "Division deleted",
            data: result,
        })
    } catch (error) {
        next(error)
    }
};

export const DivisionController = {
    createDivision,
    getAllDivisions,
    getSingleDivision,
    updateDivision,
    deleteDivision,
};