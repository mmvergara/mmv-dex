import type { AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Layout/Navbar";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { RoleContextProvider } from "../context/AuthContext";
const App = ({ Component, pageProps }: AppProps) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <RoleContextProvider>
        <Navbar />
        <ToastContainer
          position='top-left'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
        />
        <Component {...pageProps} />
      </RoleContextProvider>
    </SessionContextProvider>
  );
};

export default App;
