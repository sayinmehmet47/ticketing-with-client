import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@sayinmehmet-ticketing/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = 'expiration-service';

  onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log('Waiting this many milliseconds to process the job:', delay);
    expirationQueue.add(
      {
        orderId: data.id,
      }
      // {
      //   delay,
      // }
    );

    msg.ack();
  }
}

export { OrderCreatedListener };
