import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@sayinmehmet-ticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
