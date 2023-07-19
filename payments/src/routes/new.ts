import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@sayinmehmet-ticketing/common';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token').not().isEmpty().withMessage('token is required'),
    body('orderId').not().isEmpty().withMessage('Order Id is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    res.send({
      success: true,
    });
  }
);

export { router as createChargeRouter };
