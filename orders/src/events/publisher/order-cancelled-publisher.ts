import {
  Publisher,
  Subjects,
  OrderCancelledEvent,
} from '@sayinmehmet-ticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
