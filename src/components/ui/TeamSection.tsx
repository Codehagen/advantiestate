import Link from "next/link";
import FeatureDivider from "./FeatureDivider";

const members = [
  {
    name: "Christer Hagen",
    role: "Partner - Næringsmegler",
    avatar:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/d08a8e8b-0285-4107-bc2c-973f93b27100/public",
    slug: "christer-hagen",
    email: "christer.hagen@partners.no",
    phone: "+47 984 53 571",
  },
  {
    name: "Daniel Adamsen",
    role: "Partner - Næringsmegler",
    avatar:
      "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/bcc072c4-c35b-443b-cbc1-968474964800/public",
    slug: "daniel-adamsen",
    email: "daniel.adamsen@partners.no",
    phone: "+47 950 26 764",
  },
  // {
  //   name: "Tobias Bronder",
  //   role: "Partner - Næringsmegler",
  //   avatar:
  //     "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/e90fc23f-2f41-4f6b-302e-d83335f5bc00/public",
  //   slug: "tobias-bronder",
  //   email: "tobias.bronder@partners.no",
  //   phone: "+47 951 66 805",
  // },
  // {
  //   name: "Ole Østensen",
  //   role: "Partner - Fagansvarlig",
  //   avatar:
  //     "https://imagedelivery.net/r-6-yk-gGPtjfbIST9-8uA/17f3e8e3-3c1f-4a8e-1717-0cd273c13a00/public",
  //   slug: "ole-ostensen",
  //   email: "ole.ostensen@partners.no",
  //   phone: "+47 975 27 721",
  // },
];

export default function TeamSection() {
  return (
    <section className="bg-gray-50 py-6 md:py-6 dark:bg-transparent">
      <div className="mx-auto max-w-5xl  px-6">
        <FeatureDivider />
        <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
          <div className="sm:w-2/5">
            <h2 className="text-3xl font-bold sm:text-4xl">Vårt Team</h2>
          </div>
          <div className="mt-6 sm:mt-0">
            <p>
              Bak Advanti står et dedikert team av erfarne rådgivere med
              lidenskap for næringseiendom og et sterkt engasjement for å skape
              verdier for våre kunder i Nord-Norge.
            </p>
          </div>
        </div>
        <div className="mt-12 md:mt-24">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, index) => (
              <Link
                key={index}
                href={`/personer/${member.slug}`}
                className="group overflow-hidden"
              >
                <img
                  className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl"
                  src={member.avatar}
                  alt={`${member.name} - ${member.role}`}
                  width="826"
                  height="1239"
                />
                <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                  <div className="flex justify-between">
                    <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                      {member.name}
                    </h3>
                    <span className="text-xs">_0{index + 1}</span>
                  </div>
                  <div className="mt-1 space-y-0.5 translate-y-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-muted-foreground text-sm">
                      {member.role}
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-700 hover:text-primary-600 hover:underline dark:text-gray-300 dark:hover:text-primary-400">
                        {member.email}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-700 hover:text-primary-600 hover:underline dark:text-gray-300 dark:hover:text-primary-400">
                        {member.phone}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
