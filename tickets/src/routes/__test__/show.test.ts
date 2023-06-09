import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 401 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns the ticket if the ticket is found', async () => {
  const cookie = await global.signin();
  const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'concert',
      price: 20,
    });

  const ticketResponse = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual('concert');
  expect(ticketResponse.body.price).toEqual(20);
});
