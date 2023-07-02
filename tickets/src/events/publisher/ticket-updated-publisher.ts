import {
  Publisher,
  TicketUpdatedEvent,
  Subjects,
} from '@sayinmehmet-ticketing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;

  publish(data: TicketUpdatedEvent['data']): Promise<void> {
    return super.publish(data);
  }
}
