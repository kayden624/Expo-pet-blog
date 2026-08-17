import { useEffect, useState } from "react";
import { lookInSession } from "../servers/sessions";
import { UserAuthContext } from "./userAuthContext";

export function UserAuthProvider({ children }) {
  const [userAuth, setUserAuth] = useState({ access_token: null });

  useEffect(() => {
    const userInSession = lookInSession("user");
    if (!userInSession) {
      setUserAuth({ access_token: null });
      return;
    }

    try {
      const parsedUser = JSON.parse(userInSession);
      setUserAuth(
        parsedUser && typeof parsedUser === "object"
          ? parsedUser
          : { access_token: null }
      );
    } catch {
      sessionStorage.removeItem("user");
      setUserAuth({ access_token: null });
    }
  }, []);

  return (
    <UserAuthContext.Provider value={{ userAuth, setUserAuth }}>
      {children}
    </UserAuthContext.Provider>
  );
}
