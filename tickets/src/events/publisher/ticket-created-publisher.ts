import {
  Publisher,
  TicketCreatedEvent,
  Subjects,
} from '@sayinmehmet-ticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

  publish(data: TicketCreatedEvent['data']): Promise<void> {
    return super.publish(data);
  }
}
