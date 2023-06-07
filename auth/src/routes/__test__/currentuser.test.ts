import request from 'supertest';

import { app } from '../../app';

it('responds with details about the current user', async () => {
  // here we login by using global signin function and get the cookie
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie) // set the cookie
    .send()
    .expect(200);
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);
  expect(response.body.currentUser).toEqual(null);
});
