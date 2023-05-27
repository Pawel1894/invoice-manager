import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import "~/styles/react-datepicker.css";
import "~/styles/react-toastify.css";
import "~/styles/text-editor.css";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import { useEffect } from "react";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(LocalizedFormat);

declare global {
  interface Window {
    workbox: any;
  }
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      wb.addEventListener("installed", (event: any) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.addEventListener("controlling", (event: any) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      wb.addEventListener("activated", (event: any) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });

      const promptNewVersionAvailable = (event: any) => {
        if (
          confirm(
            "A newer version of this web app is available, reload to update?"
          )
        ) {
          wb.addEventListener("controlling", (event: any) => {
            window.location.reload();
          });

          wb.messageSkipWaiting();
        } else {
          console.log(
            "User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time."
          );
        }
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);

      wb.addEventListener("message", (event: any) => {
        console.log(`Event ${event.type} is triggered.`);
        console.log(event);
      });
      wb.register();
    }
  }, []);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
        <meta name="application-name" content="Invoice Manager" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Invoice Manager" />
        <meta name="description" content="Best Invoice Manager in the world" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="Invoice manager" />
        <meta
          name="twitter:description"
          content="Best Invoice manager in the world"
        />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@DavidWShadow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Invoice manager" />
        <meta
          property="og:description"
          content="Best Invoice manager in the world"
        />
        <meta property="og:site_name" content="Invoice manager" />
        <meta
          property="og:url"
          content="https://invoices-manager-nine.vercel.app"
        />
      </Head>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionProvider>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

export default api.withTRPC(MyApp);
