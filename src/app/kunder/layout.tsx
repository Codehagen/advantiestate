interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: MarketingLayoutProps) {
  return (
    <>
      <main>{children}</main>
    </>
  )
}
