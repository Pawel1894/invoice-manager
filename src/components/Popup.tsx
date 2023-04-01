import React from "react";

type Props = {
  isOpen: boolean;
  setIsInsertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: JSX.Element;
};

export default function Popup({ isOpen, setIsInsertOpen, children }: Props) {
  return (
    <div
      className={`${
        isOpen ? "visible bg-[rgba(0,0,0,0.4)]" : "invisible bg-transparent"
      } fixed top-0 left-0 z-10 h-screen w-screen  transition-colors`}
    >
      <div
        className={`${
          isOpen ? "w-full md:w-9/12 lg:w-[45rem]" : "w-0"
        } mt-[72px] h-[calc(100%-72px)] bg-white  pt-6 transition-width delay-150 dark:bg-neutral-700  md:rounded-r-2xl lg:mt-0 lg:h-full  lg:pl-36 lg:pt-14 `}
      >
        <button
          className="mb-6 flex items-center gap-x-6 pl-6 text-sm font-bold text-neutral-500 md:hidden"
          onClick={() => setIsInsertOpen(false)}
        >
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.342.886L2.114 5.114l4.228 4.228"
              stroke="#9277FF"
              stroke-width="2"
              fill="none"
              fill-rule="evenodd"
            />
          </svg>
          <span>Go back</span>
        </button>
        <div
          className={`${
            isOpen ? "visible opacity-100 delay-200" : "invisible opacity-0"
          } h-full transition-all`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
