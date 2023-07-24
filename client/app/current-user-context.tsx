'use client';

import { createContext, useContext } from 'react';

const CurrentUserContext = createContext({
  currentUser: {
    id: '',
    email: '',
    iat: 0,
  },
});

export default CurrentUserContext;

export const CurrentUserProvider = ({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: {
    id: string;
    email: string;
    iat: number;
  };
}) => {
  return (
    <CurrentUserContext.Provider value={{ currentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => {
  return useContext(CurrentUserContext).currentUser;
};
