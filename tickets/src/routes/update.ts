import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@sayinmehmet-ticketing/common';
import { Ticket } from '../models/ticket';
import { body } from 'express-validator';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .not()
      .isEmpty()
      .isFloat({ gt: 0 })
      .withMessage('Price is required and must be greater than 0'),
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { title, price } = req.body;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFoundError();
    }

    const creator = ticket!.userId;
    const user = req.currentUser!.id;

    if (creator !== user) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();

    const client = natsWrapper.client;

    new TicketUpdatedPublisher(client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    return res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
