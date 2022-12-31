import { createContext, useContext, useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { DatabaseTypes } from "../types/db/db-types";
import { toast } from "react-toastify";

type role = "user" | "admin" | null;
export const RoleContext = createContext<role>(null);

export const RoleContextProvider = (props: any) => {
  const supabase = useSupabaseClient<DatabaseTypes>();
  const user = useUser();
  const [role, setRole] = useState<role>(null);
  useEffect(() => {
    const setRoleFromPofile = async () => {
      if (!user?.id) {
        setRole(null);
        return;
      }
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) {
        toast.error(error.message);
        return;
      }
      if (!data) {
        setRole(null);
        return;
      }

      let role: role = null;
      if (data.role === "admin") role = data.role;
      if (data.role === "user") role = data.role;
      setRole(role);
    };
    setRoleFromPofile();
  }, [user]);
  const value = { role };
  return <RoleContext.Provider value={value} {...props} />;
};

export const useUserRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleContextProvider.");
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
