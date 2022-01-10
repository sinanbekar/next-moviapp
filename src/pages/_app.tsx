import "../styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { SeoHead } from "@/helpers/seo";
import { wrapper } from "@/app/store";
import { useUserListener } from "features/auth/authHooks";

function MoviApp({ Component, pageProps }: AppProps) {
  useUserListener();
  return (
    <>
      <SeoHead />
      <NextNProgress
        color="#fde401" //moviyellow tailwind.config.js
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <Component {...pageProps} />
    </>
  );
}

export default wrapper.withRedux(MoviApp);
