
import { NextFunction, Request, Response } from 'express';
import { TourService } from './tour.services';

const createTour = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await TourService.createTour(req.body);
        res.status(201).json({
            success: true,
            message: 'Tour created successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
};

const getAllTours = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query
        const result = await TourService.getAllTours(query as Record<string, string>);

        res.status(200).json({
            success: true,
            message: 'Tours retrieved successfully',
            // data: result.data,
            // meta: result.meta,
            data:result.documents
        })
    } catch (error) {
        next(error)
    }
};

const updateTour = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const result = await TourService.updateTour(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Tour updated successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
};

const deleteTour = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await TourService.deleteTour(id);

        res.status(200).json({
            success: true,
            message: 'Tour deleted successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
};
const getAllTourTypes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await TourService.getAllTourTypes();

        res.status(200).json({
            success: true,
            message: 'Tour types retrieved successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
};


const createTourType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const result = await TourService.createTourType(name);

        res.status(201).json({
            success: true,
            message: 'Tour type created successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
};

const updateTourType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const result = await TourService.updateTourType(id, name);

        res.status(201).json({
            success: true,
            message: 'Tour type updated successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
};
const deleteTourType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await TourService.deleteTourType(id);

        res.status(201).json({
            success: true,
            message: 'Tour type deleted successfully',
            data: result,
        })
    } catch (error) {
        next(error)
    }
};

export const TourController = {
    createTour,
    createTourType,
    getAllTourTypes,
    deleteTourType,
    updateTourType,
    getAllTours,
    updateTour,
    deleteTour,
};