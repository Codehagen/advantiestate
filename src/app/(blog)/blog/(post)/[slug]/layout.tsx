interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: MarketingLayoutProps) {
  return (
    <>
      {/* <Header /> */}
      {/* <main> landmark is provided once by the root layout */}
      {children}
      {/* <Footer /> */}
    </>
  )
}
