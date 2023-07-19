import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@sayinmehmet-ticketing/common';

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}

export { ExpirationCompletePublisher };
