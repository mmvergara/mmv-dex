import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabase/client";

export const AuthContext = createContext<{ user: User | null; session: Session | null }>({
  user: null,
  session: null,
});

export const AuthContextProvider = (props: any) => {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    console.log("USE EFFECT AUTH");
    supabase.auth.getSession().then(({ data }) => {
      setUserSession(data.session);
      setUser(data.session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Supabase auth event: ${event}`);
      setUserSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription;
    };
  }, []);

  const value = {
    userSession,
    user,
  };
  return <AuthContext.Provider value={value} {...props} />;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContextProvider.");
  }
  return context;
};

// import { User } from "@supabase/auth-helpers-nextjs";
// import { createContext, useState, useEffect, useContext } from "react";
// import { supabase } from "../supabase/client";

// const AuthContext = createContext<User | null>(null);
// export const useAuth = () => useContext(AuthContext);
// export const AuthProvider = ({ children }: { children: JSX.Element | JSX.Element[] }) => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [user, setUser] = useState<User | null>(null!);

//   useEffect(() => {
//     console.log("USEEFFECT ");
//     if(!user) {
//       const
//     }
//     supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log("AUTH STATE CHANGED: ", event);
//       if (event == "SIGNED_IN" && session) {
//         setUser(session?.user);
//       }
//       setLoading(false);
//     });
//   }, [user]);

//   return (
//     <AuthContext.Provider value={user}>{!loading ? children : "LOADING..."}</AuthContext.Provider>
//   );
// };
