import SideNav from "@/components/ui/SideNav"

export default function MarkedsinnsiktLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-8 pl-4">
      <div className="hidden lg:block">
        <SideNav />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}
