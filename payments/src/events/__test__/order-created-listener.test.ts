import { OrderStatus, OrderCreatedEvent } from '@sayinmehmet-ticketing/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'asdad',
    userId: 'âlskdjf',
    status: OrderStatus.Created,
    ticket: {
      id: 'asdas',
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    msg,
  };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order).toBeDefined();

  expect(order!.price).toEqual(data.ticket.price);

  expect(order!.userId).toEqual(data.userId);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg as any);

  expect(msg.ack).toHaveBeenCalled();
});
