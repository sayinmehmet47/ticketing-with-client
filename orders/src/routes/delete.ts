import {
  NotAuthorizedError,
  OrderStatus,
  requireAuth,
} from '@sayinmehmet-ticketing/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;

    await order.save();

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
