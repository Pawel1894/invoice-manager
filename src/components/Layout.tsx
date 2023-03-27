import { League_Spartan } from "next/font/google";
import Image from "next/image";
import ThemeToggler from "./ThemeToggler";
import User from "./User";

type Props = {
  children: JSX.Element;
  isDarkMode: boolean;
};

const spartan = League_Spartan({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-spartan",
});

export default function Layout({ children, isDarkMode }: Props) {
  console.log("isDarkModeisDarkMode", isDarkMode);
  return (
    <div>
      <aside
        className={`${spartan.variable} flex h-[4.5rem] justify-between bg-[#373B53] font-sans lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-[6.4375rem] lg:flex-col lg:rounded-r-[1.25rem]`}
      >
        <div className="relative flex h-full w-[4.5rem] items-center justify-center rounded-r-[1.25rem] bg-primary-100 before:absolute before:bottom-0 before:h-1/2 before:w-full before:rounded-br-[1.25rem] before:rounded-tl-[1.25rem] before:bg-primary-200 lg:h-[6.4375rem] lg:w-full">
          <div className="relative z-10 h-[1.625rem] w-7 lg:h-9 lg:w-10">
            <Image
              src={"/assets/logo.svg"}
              alt={"Invoices manager logo"}
              fill
            />
          </div>
        </div>
        <div className="flex gap-6 lg:flex-col lg:items-center lg:pb-6">
          <ThemeToggler isDarkMode={isDarkMode} />
          <User />
        </div>
      </aside>
      <main className={`${spartan.variable} font-sans lg:ml-[6.4375rem]`}>
        {children}
      </main>
    </div>
  );
}
