import request from 'supertest';
import { app } from '../../app';

const createTicket = async () => {
  const cookie = await global.signin();
  return request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'concert',
    price: 20,
  });
};

it('it can fetch a list of ticket', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const ticketResponse = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);
  expect(ticketResponse.body.length).toEqual(3);
});
