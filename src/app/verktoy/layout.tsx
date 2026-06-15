export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // <main> landmark is provided once by the root layout; keep the layout wrapper as a div.
  return <div className="mx-auto mt-36 max-w-6xl">{children}</div>;
}
