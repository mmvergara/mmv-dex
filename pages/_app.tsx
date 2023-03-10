import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { RoleContextProvider } from "../context/RoleContext";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import { useState } from "react";
import NProgress from "nprogress";
import Router from "next/router";
import Navbar from "../components/Navbar";

import "../styles/globals.css";
import "nprogress/nprogress.css";
import "react-toastify/dist/ReactToastify.css";

Router.events.on("routeChangeStart", () => NProgress.configure({ showSpinner: false }).start());
Router.events.on("routeChangeComplete", () => NProgress.configure({ showSpinner: false }).done());
Router.events.on("routeChangeError", () => NProgress.configure({ showSpinner: false }).done());

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
