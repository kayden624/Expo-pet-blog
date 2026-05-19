import { createContext, useEffect, useState } from "react";
import { lookInSession } from "../servers/sessions";

export const UserAuthContext = createContext({});

export function UserAuthProvider({ children }) {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInsession = lookInSession("user");

    userInsession
      ? setUserAuth(JSON.parse(userInsession))
      : setUserAuth({ access_token: null });
  }, []);

  return (
    <UserAuthContext.Provider
      value={{
        userAuth,
        setUserAuth,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}
