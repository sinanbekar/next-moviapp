import "../styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { SeoHead } from "@/helpers/seo";
//import { wrapper } from "@/app/store";
//import { Provider } from "react-redux";

function MoviApp({ Component, ...rest }: AppProps) {
  //const { store, props } = wrapper.useWrappedStore(rest);

  return (
    <>
      <SeoHead />
      <NextNProgress
        color="#fde401" //moviyellow tailwind.config.js
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
        options={{ showSpinner: false }}
      />
      <Component {...rest.pageProps} />

      {/* <Provider store={store}>
        <Component {...props.pageProps} />
      </Provider> */}
    </>
  );
}

export default MoviApp;
