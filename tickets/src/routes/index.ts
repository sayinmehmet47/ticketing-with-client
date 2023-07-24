import express, { Request, Response } from 'express';
import { NotFoundError } from '@sayinmehmet-ticketing/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  });

  if (!tickets) {
    throw new NotFoundError();
  }

  return res.status(200).send(tickets);
});

export { router as indexTicketRouter };
