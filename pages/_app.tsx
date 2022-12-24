import type { AppProps } from "next/app";
import Navbar from "../components/Layout/Navbar";
import { AuthContextProvider } from "../context/AuthContext";
import "../styles/globals.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthContextProvider>
      <Navbar/>
      <Component {...pageProps} />
    </AuthContextProvider>
  );
};
export default App;
