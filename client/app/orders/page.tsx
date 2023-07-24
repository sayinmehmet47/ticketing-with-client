import React from 'react';
import buildClient from '../api/build-client';

type Props = {};

async function getData(): Promise<
  {
    id: string;
    status: string;
    expiresAt: string;
    userId: string;
    ticket: {
      id: string;
      title: string;
      price: number;
      userId: string;
      version: number;
    };
    version: number;
  }[]
> {
  const { data } = await buildClient().get('/api/orders');
  return data;
}

const OrderIndex = async (props: Props) => {
  const orders = await getData();

  return (
    <div>
      {orders.map((order) => {
        return (
          <div key={order.id}>
            {order.ticket.title} - {order.status}
          </div>
        );
      })}
    </div>
  );
};

export default OrderIndex;
