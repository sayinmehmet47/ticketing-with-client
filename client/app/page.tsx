import NavBar from '@/components/navbar';
import buildClient from './api/build-client';

async function getData() {
  const { data } = await buildClient().get('/api/users/currentuser');
  return data;
}

export default async function LandingPage() {
  const data = await getData();

  return (
    <div>
      <h1>
        {data.currentUser ? 'You are signed in' : 'You are not signed in'}
      </h1>
    </div>
  );
}
