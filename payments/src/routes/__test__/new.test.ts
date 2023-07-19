import request from 'supertest';

import { app } from '../../app';
import { Order } from '../../models/orders';
import mongoose from 'mongoose';
import { OrderStatus } from '@sayinmehmet-ticketing/common';
import { stripe } from '../../stripe';

it('return 404 when purchasing that does not exist', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: '1223456',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    });
  expect(response.status).toEqual(404);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const cookie = await global.signin();

  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  }).save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: '1223456',
      orderId: order.id,
    });

  expect(response.status).toEqual(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = await global.signin(userId);

  const order = await Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  }).save();

  const response = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: '1223456',
      orderId: order.id,
    });

  expect(response.status).toEqual(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', await global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(200);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');
});
