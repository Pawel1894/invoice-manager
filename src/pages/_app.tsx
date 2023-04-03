import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "~/styles/react-datepicker.css";
import "~/styles/react-toastify.css";
import { ToastContainer } from "react-toastify";
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default api.withTRPC(MyApp);
