import './globals.css';
import buildClient from './api/build-client';
import NavBar from '../components/navbar';
import { CurrentUserProvider } from './current-user-context';

async function getData() {
  const { data } = await buildClient().get('/api/users/currentuser');
  return data;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
        <CurrentUserProvider currentUser={data.currentUser}>
          <NavBar />
          {children}
        </CurrentUserProvider>
      </body>
    </html>
  );
}
