import { allCustomersPosts } from "content-collections";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import MaxWidthWrapper from "@/components/blog/max-width-wrapper";
import { MDX } from "@/components/blog/mdx";
import BlurImage from "@/lib/blog/blur-image";
import { getBlurDataURL } from "@/lib/blog/images";
import { constructMetadata } from "@/lib/utils";

export async function generateStaticParams() {
  return allCustomersPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const { slug } = await params;
  const post = allCustomersPosts.find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  const { title, summary, image } = post;

  return constructMetadata({
    title: `${title} – Advanti`,
    description: summary,
    image,
    canonical: `/kunder/${slug}`,
  });
}

export default async function CustomerStory({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const { slug } = await params;
  const data = allCustomersPosts.find((post) => post.slug === slug);
  if (!data) {
    notFound();
  }

  const [thumbnailBlurhash, images] = await Promise.all([
    getBlurDataURL(data.image),
    await Promise.all(
      data.images.map(async (src: string) => ({
        src,
        blurDataURL: await getBlurDataURL(src),
      }))
    ),
  ]);

  return (
    <>
      <MaxWidthWrapper className="flex max-w-screen-lg flex-col py-10 pt-32 md:pt-40">
        <div className="flex max-w-screen-md flex-col space-y-4">
          <Link
            href="/kunder"
            className="text-sm text-warm-white/60 hover:text-warm-white/80"
          >
            ← Tilbake til kunder
          </Link>
          <h1 className="font-display text-3xl font-bold !leading-snug text-warm-white sm:text-4xl">
            {data.title}
          </h1>
          <p className="text-xl text-warm-white/80">{data.summary}</p>
        </div>
      </MaxWidthWrapper>

      <div className="relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-warm-grey-2/20 via-warm-grey-2/20 to-warm-grey-2/20" />
        <MaxWidthWrapper className="grid max-w-screen-lg grid-cols-4 gap-10 py-10">
          <div className="col-span-4 flex flex-col space-y-8 sm:col-span-3">
            <BlurImage
              className="aspect-[1200/630] rounded-xl object-cover"
              src={data.image}
              blurDataURL={thumbnailBlurhash}
              width={1200}
              height={630}
              alt={data.title}
              priority
            />
            <div className="grid grid-cols-2 gap-5 rounded-xl border border-warm-grey-2/20 bg-warm-grey-2/10 p-5 backdrop-blur-sm md:hidden">
              <div className="col-span-2 flex items-center space-x-4 py-2">
                <BlurImage
                  className="h-12 w-12 rounded-full"
                  src={data.companyLogo}
                  alt={data.company}
                  width={48}
                  height={48}
                />
                <div className="flex flex-col">
                  <p className="font-medium text-warm-white">{data.company}</p>
                  <a
                    href={data.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-warm-white/60 underline-offset-4 hover:text-warm-white/80 hover:underline"
                  >
                    {data.companyUrl}
                  </a>
                </div>
              </div>
              {sidebarContent.map(({ title, value }) => (
                <div
                  key={title}
                  className={`col-span-1 flex flex-col space-y-2 ${
                    title === "Om bedriften" ? "col-span-2" : ""
                  }`}
                >
                  <p className="font-medium text-warm-white">{title}</p>
                  <p className="text-sm text-warm-white/60">
                    {data[value as keyof typeof data]}
                  </p>
                </div>
              ))}
            </div>
            <MDX
              code={data.mdx}
              images={images}
              className="prose prose-invert prose-warm-grey max-w-none px-0 pb-20 pt-4"
            />
          </div>
          <div className="sticky top-32 col-span-1 mt-0 hidden flex-col divide-y divide-warm-grey-2/20 self-start p-4 backdrop-blur-sm md:flex">
            <div className="flex items-center space-x-4 pb-4">
              <BlurImage
                className="h-12 w-12 rounded-full"
                src={data.companyLogo}
                alt={data.company}
                width={48}
                height={48}
              />
              <div className="flex flex-col">
                <p className="font-medium text-warm-white">{data.company}</p>
                <a
                  href={data.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-warm-white/60 underline-offset-4 hover:text-warm-white/80 hover:underline"
                >
                  {data.companyUrl}
                </a>
              </div>
            </div>
            {sidebarContent.map(({ title, value }) => (
              <div
                key={title}
                className="flex flex-col space-y-1 py-4 first:pt-4 last:pb-0"
              >
                <p className="font-medium text-warm-white">{title}</p>
                <p className="text-sm text-warm-white/60">
                  {data[value as keyof typeof data]}
                </p>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}

const sidebarContent = [
  {
    title: "Om bedriften",
    value: "companyDescription",
  },
  {
    title: "Bransje",
    value: "companyIndustry",
  },
  {
    title: "Selskapsstørrelse",
    value: "companySize",
  },
  {
    title: "Stiftet",
    value: "companyFounded",
  },
  {
    title: "Tjeneste levert",
    value: "plan",
  },
];
