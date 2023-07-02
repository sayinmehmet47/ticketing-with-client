import {
  Publisher,
  TicketCreatedEvent,
  Subjects,
} from '@sayinmehmet-ticketing/common';

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;

  publish(data: TicketCreatedEvent['data']): Promise<void> {
    return super.publish(data);
  }
}

export { TicketCreatedPublisher };
