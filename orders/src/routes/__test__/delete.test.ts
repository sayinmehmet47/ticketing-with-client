import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@sayinmehmet-ticketing/common';
import { natsWrapper } from '../../nats-wrapper';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('should delete order', async () => {
  const ticket = await buildTicket();

  const userOne = await global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userOne)
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('should emit order cancelled event', async () => {
  const ticket = await buildTicket();

  const userOne = await global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userOne)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
