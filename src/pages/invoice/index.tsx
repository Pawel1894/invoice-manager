import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/Layout";
import LoadIndicator from "~/components/LoadIndicator";

export default function Invoice() {
  const { data, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LoadIndicator />
      </div>
    );
  }

  if (status === "unauthenticated") {
    void router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>Invoices</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {status === "authenticated" ? (
        <Layout>
          <span>test</span>
        </Layout>
      ) : null}
    </>
  );
}
