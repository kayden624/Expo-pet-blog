import { useEffect, useState } from "react";
import { lookInSession } from "../servers/sessions";
import { UserAuthContext } from "./userAuthContext";

export function UserAuthProvider({ children }) {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    const userInSession = lookInSession("user");
    setUserAuth(userInSession ? JSON.parse(userInSession) : { access_token: null });
  }, []);

  return (
    <UserAuthContext.Provider value={{ userAuth, setUserAuth }}>
      {children}
    </UserAuthContext.Provider>
  );
}
