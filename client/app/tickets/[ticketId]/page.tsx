import buildClient from '@/app/api/build-client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CardButton } from './card-button';

async function getData(url: string): Promise<{
  title: string;
  price: number;
  userId: string;
  id: string;
  version: number;
}> {
  const { data } = await buildClient().get(url);
  return data;
}

const TicketDetails = async ({
  params,
  className,
}: {
  params: {
    ticketId: string;
  };
  className?: string;
}) => {
  const ticketId = params.ticketId;
  const data = await getData(`/api/tickets/${ticketId}`);

  return (
    <Card className={cn('w-[380px]  mx-auto mt-10', className)}>
      <CardHeader>
        <CardTitle>Rock Concert</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-10">
        <div>
          <CardDescription>Price</CardDescription>
          <div className="font-bold">${data.price}</div>

          <CardDescription>Status</CardDescription>

          <div className="font-bold">Available</div>

          <CardDescription>Owner</CardDescription>
          <div className="font-bold">{data.userId}</div>
        </div>
      </CardContent>
      <CardButton ticket={data} />
    </Card>
  );
};

export default TicketDetails;
