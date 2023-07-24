import buildClient from '@/app/api/build-client';
import TimeLeft from './time-left';

async function getData(url: string): Promise<{
  id: string;
  userId: string;
  status: string;
  expiresAt: string;
  ticket: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
  };
  version: number;
}> {
  const { data } = await buildClient().get(url);
  return data;
}

const OrderDetailPage = async ({
  params,
}: {
  params: {
    orderId: string;
  };
}) => {
  const orderId = params.orderId;

  const data = await getData(`/api/orders/${orderId}`);
  const msLeft = new Date(data.expiresAt).getTime() - new Date().getTime();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-2xl font-bold">Order Details</div>
      <div className="text-xl font-bold">Ticket: {data.ticket.title}</div>
      <div className="text-xl font-bold">Price: ${data.ticket.price}</div>
      <div className="text-xl font-bold">Status: {data.status}</div>

      <TimeLeft
        data={data}
        msLeft={msLeft}
        price={data.ticket.price}
        orderId={orderId}
      />
    </div>
  );
};

export default OrderDetailPage;
