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
  return (
    <div>
      <aside
        className={`${spartan.variable} flex h-[4.5rem] justify-between bg-[#373B53] font-sans md:fixed md:left-0 md:h-screen md:w-[6.4375rem] md:flex-col md:rounded-r-[1.25rem]`}
      >
        <div className="relative flex h-full w-[4.5rem] items-center justify-center rounded-r-[1.25rem] bg-primary-100 before:absolute before:bottom-0 before:h-1/2 before:w-full before:rounded-br-[1.25rem] before:rounded-tl-[1.25rem] before:bg-primary-200 md:h-[6.4375rem] md:w-full">
          <div className="relative z-10 h-[1.625rem] w-7 md:h-9 md:w-10">
            <Image
              src={"/assets/logo.svg"}
              alt={"Invoices manager logo"}
              fill
            />
          </div>
        </div>
        <div className="flex gap-6 md:flex-col md:items-center md:pb-6">
          <ThemeToggler isDarkMode={isDarkMode} />
          <User />
        </div>
      </aside>
      <main className={`${spartan.variable} font-sans`}>{children}</main>
    </div>
  );
}
