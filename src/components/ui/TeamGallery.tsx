import { InstaxImage } from "./InstaxImage"

export default function TeamGallery() {
  return (
    <section
      aria-labelledby="teamwork-title"
      className="mx-auto mt-5 max-w-4xl animate-slide-up-fade"
      style={{
        animationDuration: "600ms",
        animationDelay: "200ms",
        animationFillMode: "backwards",
      }}
    >
      <div className="mt-20">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <InstaxImage
            className="w-[25rem] -rotate-6 sm:-ml-10"
            src="/images/working.webp"
            alt="To utviklere som jobber med kode"
            width={640}
            height={427}
            caption="Her hos oss bruker vi datamaskiner"
          />
          <InstaxImage
            className="w-[15rem] rotate-3"
            src="/images/workplace.webp"
            alt="Kontor med telefonboks"
            width={640}
            height={853}
            caption="Våre telefonbokser er helt rå"
          />
          <InstaxImage
            className="-mr-10 w-[15rem] rotate-1"
            src="/images/home.webp"
            alt="Bilde av kontoret vårt"
            width={640}
            height={960}
            caption="Hjemme kjære hjemme"
          />
        </div>
        <div className="mt-8 hidden w-full justify-between gap-4 md:flex">
          <InstaxImage
            className="-ml-16 w-[25rem] rotate-1"
            src="/images/break.webp"
            alt="Team som tar en pause"
            width={640}
            height={360}
            caption="Noen ganger tar vi en pause"
          />
          <InstaxImage
            className="-mt-10 w-[15rem] -rotate-3"
            src="/images/cool.webp"
            alt="Person med hodetelefoner"
            width={640}
            height={965}
            caption="Christer styrer spillelista"
          />
          <InstaxImage
            className="-mr-20 -mt-2 w-[30rem] rotate-[8deg]"
            src="/images/release.webp"
            alt="Bilde av fest med konfetti"
            width={1920}
            height={1281}
            caption="v1.0 Lanseringsfest. Vår praktikant fikk sin første alkoholfrie øl"
          />
        </div>
      </div>
      <div className="mt-28">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <InstaxImage
            className="w-full rotate-1"
            src="/images/founders.webp"
            alt="Bli med i Propdock, vær deg selv"
            width={1819}
            height={998}
            caption="Bli med i Propdock, vær deg selv"
          />
        </div>
      </div>
    </section>
  )
}
