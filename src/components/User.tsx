import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import useClickOutside from "~/hooks/useClickOutside";

export default function User() {
  const { data } = useSession();
  const { isComponentVisible, ref, setIsComponentVisible } =
    useClickOutside<HTMLDivElement>(false);

  return (
    <div className="relative border-l border-l-[#494E6E] px-6 md:mx-auto md:w-full md:border-l-0 md:border-t md:border-t-[#494E6E] md:pt-6">
      <button
        onClick={() => setIsComponentVisible(true)}
        className="h-full w-full"
      >
        <img
          className="h-8 w-8 rounded-full md:mx-auto md:h-10 md:w-10"
          src={data?.user.image ?? "/assets/image-avatar.jpg"}
          alt={"Your profile"}
        />
      </button>
      {isComponentVisible ? (
        <div
          ref={ref}
          className={
            "absolute top-[2.5rem] right-4 rounded-3xl bg-white p-4 shadow-lg md:bottom-1/3 md:top-auto md:left-3/4 md:right-auto"
          }
        >
          <div className="grid grid-cols-[64px_1fr] gap-4">
            <img
              className="rounded-full"
              src={data?.user.image ?? "/assets/image-avatar.jpg"}
              alt={"Your profile"}
              width={64}
              height={64}
            />
            <div className="w-[calc(100%-1rem)]">
              <span
                title={data?.user.name ?? ""}
                className="block overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {data?.user.name}
              </span>
              <span
                title={data?.user.email ?? ""}
                className="block overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {data?.user.email}
              </span>
            </div>
          </div>
          <div className="mt-4 flex w-full items-end justify-end">
            <button
              className="rounded-3xl text-primary-100"
              onClick={() =>
                void signOut({
                  callbackUrl: window.origin + "/",
                })
              }
            >
              Sign out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
