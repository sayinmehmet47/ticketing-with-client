import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after signing out', async () => {
  // first sign up
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  // then sign out
  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  // then check if cookie is cleared
  expect(response.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
