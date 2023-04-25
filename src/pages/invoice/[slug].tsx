import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import type { NextApiRequest, NextApiResponse } from "next";
import superjson from "superjson";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Heading from "~/components/Invoice/Heading";
import Layout from "~/components/Layout";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import Items from "~/components/Invoice/Items";
import { type countryName, formatCurrency } from "~/utils/calcs";
import { toast } from "react-toastify";
import EmailForm from "~/components/Form/EmailForm";
import DeleteForm from "~/components/Form/DeleteForm";
import Popup from "~/components/Popup";
import InvoiceEdit from "~/components/Form/InvoiceEdit";

export default function InvoicePage() {
  const router = useRouter();
  const { slug } = router.query;
  const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
  const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: theme } = api.user.getPrefTheme.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (theme?.darkMode) {
      document.getElementsByTagName("body")[0]?.classList.add("dark");
    }
  }, []);

  const {
    data: invoice,
    status,
    error,
  } = api.invoice.get.useQuery(slug as string);

  if (status === "error") {
    toast.error(`Fetching invoice failed: ${error.message}`);
  }

  function openSendPopup() {
    if (invoice) {
      setIsEmailPopupOpen(true);
    }
  }
  return (
    <>
      <Head>
        <title>Invoices</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout isDarkMode={theme?.darkMode ?? false}>
        <>
          {invoice ? (
            <Popup isOpen={isEditOpen} setIsOpen={setIsEditOpen}>
              <InvoiceEdit initData={invoice} setIsEditOpen={setIsEditOpen} />
            </Popup>
          ) : null}
          {isEmailPopupOpen && invoice ? (
            <EmailForm
              isDetails={true}
              setIsEmailPopupOpen={setIsEmailPopupOpen}
              initData={invoice}
            />
          ) : null}
          {isDeletePromptOpen && invoice ? (
            <DeleteForm
              setIsOpen={setIsDeletePromptOpen}
              invoiceId={invoice?.id}
              number={invoice?.number}
            />
          ) : null}
          <div className="mx-6 pt-8 pb-5 md:mx-12 lg:pt-20">
            {status === "success" && !invoice ? (
              <div>
                <button
                  className="mb-6 flex items-center gap-x-6 text-sm font-bold text-neutral-500"
                  onClick={() => void router.push("/invoice")}
                >
                  <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6.342.886L2.114 5.114l4.228 4.228"
                      stroke="#9277FF"
                      strokeWidth="2"
                      fill="none"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-500 dark:text-neutral-600">
                    Go to invoices list
                  </span>
                </button>
                <span className="dark:text-white">
                  Sorry, Invoice {slug} does not exists. Search for invoice on
                  homepage
                </span>
              </div>
            ) : (
              <div className="mx-auto max-w-screen-lg">
                <button
                  className="mb-6 flex items-center gap-x-6 text-sm font-bold text-neutral-500"
                  onClick={() => void router.push("/invoice")}
                >
                  <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M6.342.886L2.114 5.114l4.228 4.228"
                      stroke="#9277FF"
                      strokeWidth="2"
                      fill="none"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="text-neutral-500 dark:text-neutral-600">
                    Go back
                  </span>
                </button>
                <Heading
                  openSendPopup={openSendPopup}
                  invoiceId={slug as string}
                  status={invoice?.status}
                  setIsDeletePromptOpen={setIsDeletePromptOpen}
                  setIsEditOpen={setIsEditOpen}
                />
                <div className="mt-4 max-h-[calc(100vh-19rem)] overflow-y-auto overflow-x-hidden rounded-lg bg-white px-6 py-6 shadow-light dark:bg-neutral-100 lg:max-h-[calc(100vh-250px)]">
                  <div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold dark:text-white">
                        <span className="text-neutral-900 ">#</span>
                        {invoice?.number}
                      </span>
                      <span className="block max-w-[30ch] text-sm text-neutral-900">
                        {invoice?.decription}
                      </span>
                    </div>
                    <div className="flex flex-col text-sm text-neutral-900">
                      <span>{invoice?.name}</span>
                      <span>{invoice?.streetAddress}</span>
                      <span>{invoice?.city}</span>
                      <span>{invoice?.postCode}</span>
                      <span>{invoice?.country}</span>
                      <span>{invoice?.idNo}</span>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 ">
                    <div className="flex flex-col gap-8">
                      <div>
                        <span className="text-sm text-neutral-900">
                          Invoice Date
                        </span>
                        <span className="mt-3 block font-bold dark:text-white">
                          {dayjs(invoice?.invoiceDate.toString()).format("LL")}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-neutral-900">
                          Payment Due
                        </span>
                        <span className="mt-3 block  font-bold dark:text-white">
                          {dayjs(invoice?.dueDate.toString()).format("LL")}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-neutral-900">Bill To</span>
                      <span className="mt-3 block max-w-[25ch] font-bold dark:text-white">
                        {invoice?.clientName}
                      </span>
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {invoice?.clientStreetAddress}
                      </span>
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {invoice?.clientCity}
                      </span>
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {invoice?.clientPostCode}
                      </span>
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {invoice?.clientCountry}
                      </span>
                      <span className="text-sm text-neutral-900 dark:text-white">
                        {invoice?.clientId}
                      </span>
                    </div>
                    <div>
                      <div className="col-span-full flex flex-col lg:col-auto">
                        <span className="text-sm text-neutral-900">Bank</span>
                        <span className="mt-3 block  font-bold dark:text-white">
                          {invoice?.bankAccount}
                        </span>
                      </div>
                      <div className="mt-8">
                        <span className="text-sm text-neutral-900">
                          Sent to
                        </span>
                        <span className="mt-3 block  font-bold dark:text-white">
                          {invoice?.clientEmail}
                        </span>
                      </div>
                    </div>
                  </div>
                  {invoice?.items?.length ? (
                    <>
                      <Items
                        currencyCountry={invoice.currencyCountry}
                        items={invoice.items}
                      />
                      <div className="rounded-b-lg bg-accent-400 p-6 text-white dark:bg-neutral-500">
                        <div className="flex justify-between">
                          <span>Net Total</span>
                          <span className="font-bold">
                            {formatCurrency(
                              invoice?.currencyCountry as countryName,
                              invoice?.totalAmount ?? 0
                            )}
                          </span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <span>Gross Total</span>
                          <span className="font-bold">
                            {formatCurrency(
                              invoice?.currencyCountry as countryName,
                              invoice?.grossTotalAmount ?? 0
                            )}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </>
      </Layout>
    </>
  );
}

export const getServerSideProps = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await getSession({ req });
  const slug = req.url?.split("/")[2];

  if (!session?.user || !slug) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext({
      req: req,
      res: res,
    }),
    transformer: superjson,
  });

  await ssg.user.getPrefTheme.prefetch();
  await ssg.invoice.get.prefetch(slug);

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};
