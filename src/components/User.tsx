import { signOut, useSession } from "next-auth/react";
import React from "react";
import useClickOutside from "~/hooks/useClickOutside";

export default function User() {
  const { data } = useSession();
  const { isComponentVisible, ref, setIsComponentVisible } =
    useClickOutside<HTMLDivElement>(false);
  return (
    <div className="relative border-l border-l-[#494E6E]  lg:mx-auto lg:w-full lg:border-l-0 lg:border-t lg:border-t-[#494E6E] ">
      <button
        data-testid="userProfile"
        onClick={() => setIsComponentVisible(true)}
        className="h-full w-full px-6 lg:px-0 lg:pt-6"
      >
        <img
          className="rounded-full lg:mx-auto lg:h-10 lg:w-10"
          src={
            data?.user.image ? data?.user.image : "/assets/image-avatar.webp"
          }
          width={32}
          height={32}
          alt={"Your profile"}
        />
      </button>
      {isComponentVisible ? (
        <div
          data-testid="userPopup"
          ref={ref}
          className={
            "absolute top-[2.5rem] right-4 rounded-3xl bg-white p-4 shadow-lg dark:bg-neutral-200 dark:text-neutral-800 lg:bottom-1/3 lg:top-auto lg:left-3/4 lg:right-auto"
          }
        >
          <div className="grid grid-cols-[64px_1fr] gap-4">
            <img
              className="rounded-full"
              src={
                data?.user.image
                  ? data?.user.image
                  : "/assets/image-avatar.webp"
              }
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
              className="rounded-3xl text-primary-100 dark:text-white"
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
