import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from '@sayinmehmet-ticketing/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: any) {
    const { title, price, id } = data;

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });

    await ticket.save();

    msg.ack();
  }
}
