import { createContext, useContext, useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { DatabaseTypes } from "../types/db/db-types";
import { toast } from "react-toastify";

type role = "user" | "admin" | null;
export const RoleContext = createContext<role>(null);
export const RoleContextProvider = (props:any) => {
  const supabase = useSupabaseClient<DatabaseTypes>();
  const user = useUser();
  const [role, setRole] = useState<role>(null);
  useEffect(() => {
    const setRoleFromPofile = async () => {
      if (!user?.id) {
        setRole(null);
        return;
      }
      console.log("AUTH CONTEXT USE EEFFECT");
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

  return <RoleContext.Provider value={role} {...props} />;
};

export const useUserRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleContextProvider.");
  }
  return context;
};
