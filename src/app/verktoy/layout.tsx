export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Full-bleed editorial pages (the hub + naringskalkulator) own their own
  // width via the design system's `.wrap`/`.section` primitives, so the <main>
  // stays neutral. The calculator subpages self-constrain in CalculatorLayout.
  return <main>{children}</main>;
}
