export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The <main> landmark is provided once by the root layout, so this wrapper is
  // a neutral pass-through. It deliberately carries NO width cap: the full-bleed
  // editorial pages (the Verktøy hub, naringskalkulator, off-market) own their
  // width via the design system's `.wrap`/`.section` primitives, and the
  // calculator subpages self-constrain in CalculatorLayout.
  return <div>{children}</div>;
}
