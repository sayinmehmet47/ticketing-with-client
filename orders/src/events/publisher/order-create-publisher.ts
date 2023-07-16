import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from '@sayinmehmet-ticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
