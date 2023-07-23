import NavBar from '@/components/navbar';
import buildClient from './api/build-client';
import { DataTable } from './data-table';
import { columns } from './columns';

async function getData() {
  const { data } = await buildClient().get('/api/tickets');
  return data;
}

export default async function LandingPage() {
  const data = await getData();
  console.log('data', data);

  return (
    <div>
      {/* <h1>
        {data.currentUser ? 'You are signed in' : 'You are not signed in'}
        {JSON.stringify(data)}
      </h1> */}

      <DataTable columns={columns} data={data} />
    </div>
  );
}
