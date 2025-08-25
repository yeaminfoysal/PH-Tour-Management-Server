import { NextFunction, Request, Response } from "express";
import { StatsService } from "./stats.service";
import { Payment } from "../payment/payment.model";

const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await StatsService.getUserStats();

        res.status(200).json({
            success: true,
            message: "User stats fetched successfully",
            data: stats,
        })
    } catch (error) {
        next(error)
    }
};

const getTourStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await StatsService.getTourStats();

        res.status(200).json({
            success: true,
            message: "User stats fetched successfully",
            data: stats,
        })
    } catch (error) {
        next(error)
    }
};

const getBookingStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await StatsService.getBookingStats();

        res.status(200).json({
            success: true,
            message: "User stats fetched successfully",
            data: stats,
        })
    } catch (error) {
        next(error)
    }
};

const getPaymentStats = async () => {

    const totalPaymentPromise = Payment.countDocuments();

    const totalPaymentByStatusPromise = Payment.aggregate([
        //stage 1 group
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    const totalRevenuePromise = Payment.aggregate([
        //stage1 match stage
        {
            $match: { status: "PAID" }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ])

    const avgPaymentAmountPromise = Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: null,
                avgPaymentAMount: { $avg: "$amount" }
            }
        }
    ])

    const paymentGatewayDataPromise = Payment.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ])



    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData] = await Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise

    ])
    return { totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData }
}

export const StatsController = {
    getUserStats,
    getTourStats,
    getBookingStats,
    getPaymentStats
}