import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { ExpirationCompleteEventListener } from '../expiration-complete-listener';
import {
  ExpirationCompleteEvent,
  OrderCreatedEvent,
  OrderStatus,
} from '@sayinmehmet-ticketing/common';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new ExpirationCompleteEventListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, order };
};

it('updates the order status to cancelled', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(order.status).toEqual(OrderStatus.Created);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(msg.ack).toHaveBeenCalled();
});
it('emit order cancelled event', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
