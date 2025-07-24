import React, { createContext, useContext, useState } from 'react';
import { User } from '../api/types';

type UserContextState = [User | null, (user: User | null) => void];

const UserContext = createContext<UserContextState | null>(null);

export function UserContextProvide({
  children,
}: {
  children: React.ReactNode;
}) {
  const userState = useState<User | null>(null);
  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
}

export function useUserState() {
  const userState = useContext(UserContext);
  if (!userState) {
    throw new Error('UserContext is no used');
  }
  return userState;
}
