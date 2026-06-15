interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: MarketingLayoutProps) {
  return (
    <>
      {/* <main> landmark is provided once by the root layout */}
      {children}
    </>
  )
}
