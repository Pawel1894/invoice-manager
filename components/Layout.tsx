import { League_Spartan } from "next/font/google";

type Props = {
  children: JSX.Element;
};

const spartan = League_Spartan({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-spartan",
});

export default function Layout({ children }: Props) {
  return (
    <div>
      <aside className={`${spartan.variable} font-sans`}></aside>
      <main className={`${spartan.variable} font-sans`}>{children}</main>
    </div>
  );
}
