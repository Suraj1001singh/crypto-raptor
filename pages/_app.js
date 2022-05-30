import "../styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { AppContextProvider } from "../context/AppContext";
function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </ChakraProvider>
  );
}

export default MyApp;
