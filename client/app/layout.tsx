import './globals.css';
import buildClient from './api/build-client';
import NavBar from '../components/navbar';

async function getData() {
  const { data } = await buildClient().get('/api/users/currentuser');
  return data;
}

export default async function RootLayout({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) {
  const data: {
    currentUser: {
      id: string;
      email: string;
      iat: number;
    };
  } = await getData();

  return (
    <html lang="en">
      <body>
        <NavBar currentUser={data.currentUser} />
        {children}
      </body>
    </html>
  );
}
