import {
  OrderStatus,
  OrderCreatedEvent,
  OrderCancelledEvent,
} from '@sayinmehmet-ticketing/common';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';

import { Message } from 'node-nats-streaming';
import { Order } from '../../models/orders';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'asdasd',
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'asdasd',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    order,
    data,
    msg,
  };
};

it('should cancel the order', async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);

  expect(order.status).toEqual(OrderStatus.Created);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg as any);

  expect(msg.ack).toHaveBeenCalled();
});
