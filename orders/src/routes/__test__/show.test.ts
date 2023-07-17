import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it('fetches orders for an particular user', async () => {
  const ticket = await buildTicket();

  const userOne = await global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userOne)
    .expect(200);

  expect(response.body.id).toEqual(order.id);
});

it('should fail if the user not authenticated', async () => {
  const ticket = await buildTicket();

  const userOne = await global.signin();
  const userTwo = await global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .expect(401);
});
