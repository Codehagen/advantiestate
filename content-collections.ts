// @ts-nocheck — build-time content-collections config. The transform/computed
// callbacks receive documents typed loosely by @content-collections/core, so
// tsc cannot statically verify this file. It is compiled by content-collections'
// own pipeline, not by the app's `tsc --noEmit`.
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { remarkGfm } from "fumadocs-core/mdx-plugins";
import GithubSlugger from "github-slugger";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

const computedFields = (
  type: "blog" | "changelog" | "customers" | "help" | "legal" | "integrations",
) => ({
  slug: (document) => {
    const slugger = new GithubSlugger();
    return document.slug || slugger.slug(document.title);
  },
  tableOfContents: (document) => {
    const content =
      document.content || document.body?.raw || document.mdx?.code || "";
    const headings = content.match(/^##\s(.+)$/gm);
    const slugger = new GithubSlugger();
    return (
      headings?.map((heading) => {
        const title = heading.replace(/^##\s/, "");
        return {
          title,
          slug: slugger.slug(title),
        };
      }) || []
    );
  },
  images: (document) => {
    if (!document.body?.raw) return [];
    return (
      document.body.raw.match(/(?<=<Image[^>]*\bsrc=")[^"]+(?="[^>]*\/>)/g) ||
      []
    );
  },
  tweetIds: (document) => {
    if (!document.body?.raw) return [];
    const tweetMatches = document.body.raw.match(/<Tweet\sid="[0-9]+"\s\/>/g);
    return tweetMatches?.map((tweet) => tweet.match(/[0-9]+/g)[0]) || [];
  },
  githubRepos: (document) => {
    if (!document.body?.raw) return [];
    return (
      document.body.raw.match(
        /(?<=<GithubRepo[^>]*\burl=")[^"]+(?="[^>]*\/>)/g,
      ) || []
    );
  },
});

const BlogPost = defineCollection({
  name: "BlogPost",
  directory: "src/content/blog",
  include: "**/*.mdx",
  schema: (z) => ({
    title: z.string(),
    categories: z
      .array(z.enum(["company", "valuation", "market-analysis", "casestudies"]))
      .default(["company"]),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    featured: z.boolean().default(false),
    image: z.string(),
    images: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    author: z.string(),
    summary: z.string(),
    related: z.array(z.string()).optional(),
    githubRepos: z.array(z.string()).optional(),
    tweetIds: z.array(z.string()).optional(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      });
      console.log("MDX compilation successful for:", document.title);
      const computed = computedFields("blog");
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        related: document.related || [],
        tableOfContents: computed.tableOfContents({
          ...document,
          body: { raw: mdx.raw },
        }),
        images: computed.images({ ...document, body: { raw: mdx.raw } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx.raw } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx.raw },
        }),
      };
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error);
      console.error("Error details:", error.stack);
      throw error;
    }
  },
});

const ChangelogPost = defineCollection({
  name: "ChangelogPost",
  directory: "src/content/changelog",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    summary: z.string(),
    image: z.string(),
    author: z.string(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      });
      console.log("MDX compilation successful for:", document.title);
      const computed = computedFields("changelog");
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        tableOfContents: computed.tableOfContents({
          ...document,
          body: { raw: mdx.raw },
        }),
        images: computed.images({ ...document, body: { raw: mdx.raw } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx.raw } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx.raw },
        }),
      };
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error);
      console.error("Error details:", error.stack);
      throw error;
    }
  },
});

export const CustomersPost = defineCollection({
  name: "CustomersPost",
  directory: "src/content/customers",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string(),
    image: z.string(),
    company: z.string(),
    companyLogo: z.string(),
    companyUrl: z.string(),
    companyDescription: z.string(),
    companyIndustry: z.string(),
    companySize: z.string(),
    companyFounded: z.number(),
    plan: z.string(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      });
      console.log("MDX compilation successful for:", document.title);
      const computed = computedFields("customers");
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        tableOfContents: computed.tableOfContents({
          ...document,
          body: { raw: mdx.raw },
        }),
        images: computed.images({ ...document, body: { raw: mdx.raw } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx.raw } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx.raw },
        }),
      };
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error);
      console.error("Error details:", error.stack);
      throw error;
    }
  },
});

export const HelpPost = defineCollection({
  name: "HelpPost",
  directory: "src/content/help",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    updatedAt: z.string(),
    summary: z.string(),
    author: z.string(),
    categories: z
      .array(
        z.enum([
          "overview",
          "getting-started",
          "terms",
          "for-investors",
          "analysis",
          "valuation",
        ]),
      )
      .default(["overview"]),
    related: z.array(z.string()).optional(),
    excludeHeadingsFromSearch: z.boolean().optional(),
    // Opt-in HowTo schema. Only set on genuine step-by-step procedural
    // articles — the emitted JSON-LD MUST mirror visible page content (Google
    // and schema.org policy), so author the `step` array to match a visible
    // <Stepper> or numbered section on the page. `step` uses the singular form
    // per schema.org (supersedes the older `steps`).
    howto: z.boolean().optional(),
    step: z
      .array(z.object({ name: z.string(), text: z.string() }))
      .min(2)
      .optional(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      });

      const computed = computedFields("help");

      const result = {
        ...document,
        slug: computed.slug(document),
        mdx,
        tableOfContents: computed.tableOfContents(document),
        images: computed.images(document),
        tweetIds: computed.tweetIds(document),
        githubRepos: computed.githubRepos(document),
      };

      return result;
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error);
      console.error("Error details:", error.stack);
      throw error;
    }
  },
});

export const LegalPost = defineCollection({
  name: "LegalPost",
  directory: "src/content/legal",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    updatedAt: z.string(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      });
      console.log("MDX compilation successful for:", document.title);
      const computed = computedFields("legal");
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        tableOfContents: computed.tableOfContents({
          ...document,
          body: { raw: mdx.raw },
        }),
        images: computed.images({ ...document, body: { raw: mdx.raw } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx.raw } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx.raw },
        }),
      };
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error);
      console.error("Error details:", error.stack);
      throw error;
    }
  },
});

export const IntegrationsPost = defineCollection({
  name: "IntegrationsPost",
  directory: "src/content/integrations",
  include: "*.mdx",
  schema: (z) => ({
    title: z.string(),
    publishedAt: z.string(),
    summary: z.string(),
    image: z.string(),
    company: z.string(),
    companyLogo: z.string(),
    companyUrl: z.string(),
    companyDescription: z.string(),
    integrationType: z.string(),
    integrationDescription: z.string(),
    compatibility: z.string(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      });
      console.log("MDX compilation successful for:", document.title);
      const computed = computedFields("integrations");
      return {
        ...document,
        slug: computed.slug(document),
        mdx,
        tableOfContents: computed.tableOfContents({
          ...document,
          body: { raw: mdx.raw },
        }),
        images: computed.images({ ...document, body: { raw: mdx.raw } }),
        tweetIds: computed.tweetIds({ ...document, body: { raw: mdx.raw } }),
        githubRepos: computed.githubRepos({
          ...document,
          body: { raw: mdx.raw },
        }),
      };
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error);
      console.error("Error details:", error.stack);
      throw error;
    }
  },
});

export const PersonPost = defineCollection({
  name: "PersonPost",
  directory: "src/content/people",
  include: "*.mdx",
  schema: (z) => ({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
    email: z.string().email().optional(),
    phone: z.string(),
    startedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    yearsExperienceOverride: z.number().optional(),
    education: z.array(
      z.object({
        degree: z.string(),
        school: z.string(),
        year: z.number(),
      }),
    ),
    certifications: z.array(z.string()).optional(),
    linkedin: z.string().url().optional(),
    specializations: z.array(z.string()),
    notableProjects: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          year: z.number(),
        }),
      )
      .optional(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      });
      console.log("MDX compilation successful for:", document.name);
      const slugger = new GithubSlugger();

      // Calculate years of experience
      const startDate = new Date(document.startedAt);
      const now = new Date();
      const yearsExperience =
        document.yearsExperienceOverride ??
        Math.floor(
          (now.getTime() - startDate.getTime()) /
            (1000 * 60 * 60 * 24 * 365.25),
        );

      return {
        ...document,
        slug: document.slug || slugger.slug(document.name),
        mdx,
        yearsExperience,
      };
    } catch (error) {
      console.error("Error compiling MDX for:", document.name, error);
      console.error("Error details:", error.stack);
      throw error;
    }
  },
});

export const LocationPost = defineCollection({
  name: "LocationPost",
  directory: "src/content/locations",
  include: "**/*.mdx",
  schema: (z) => ({
    name: z.string(),
    order: z.number(),
    region: z.string(),
    serviceArea: z.enum(["City", "Region"]).default("City"),
    hero: z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
    }),
    officeAddress: z
      .object({
        streetAddress: z.string(),
        addressLocality: z.string(),
        addressRegion: z.string(),
        postalCode: z.string(),
        addressCountry: z.string(),
      })
      .optional(),
    phone: z.string(),
    geo: z.object({
      latitude: z.string(),
      longitude: z.string(),
    }),
    marketStats: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        detail: z.string().optional(),
      }),
    ),
    localCaseStudy: z.object({
      title: z.string(),
      summary: z.string(),
      href: z.string(),
    }),
    localTeam: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          slug: z.string().optional(),
          image: z.string().optional(),
        }),
      )
      .optional(),
    faqs: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
    nearbyLocations: z.array(z.string()).optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      });
      console.log("MDX compilation successful for:", document.name);
      const slugger = new GithubSlugger();

      return {
        ...document,
        slug: document.slug || slugger.slug(document.name),
        mdx,
      };
    } catch (error) {
      console.error("Error compiling MDX for:", document.name, error);
      console.error("Error details:", error.stack);
      throw error;
    }
  },
});

export const ListingPost = defineCollection({
  name: "ListingPost",
  directory: "src/content/listings",
  include: "*.mdx",
  schema: (z) => ({
    // Editorial title — split into a non-italic head and an italic tail so
    // the H1 + listing-card H3 render with the design's two-tone treatment
    // without authors having to embed JSX in frontmatter. `title` (plain) is
    // used for metadata, sitemap, and JSON-LD.
    title: z.string(),
    titleHead: z.string(),
    titleTail: z.string(),

    // Taxonomy
    status: z.enum(["til-salgs", "reservert", "kommer", "solgt"]),
    statusLabel: z.string().optional(),
    type: z.enum([
      "kontor",
      "logistikk",
      "handel",
      "kombi",
      "hotell",
      "utvikling",
      "industri",
    ]),
    typeLabel: z.string(),
    city: z.enum([
      "bodo",
      "tromso",
      "harstad",
      "alta",
      "narvik",
      "lofoten",
      "mo-i-rana",
    ]),

    // Identity
    address: z.string(),
    reference: z.string(),
    cardEyebrow: z.string(),
    featured: z.boolean().default(false),
    featuredEyebrow: z.string().optional(),
    order: z.number(),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updatedAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional(),

    // Headline stats
    bta: z.number(),
    prisantydning: z.number().optional(),
    prisantydningEstimat: z.boolean().default(false),
    yieldNetto: z.number().optional(),
    yieldEstimat: z.boolean().default(false),
    utleiegrad: z.number().optional(),
    wault: z.number().optional(),
    ferdig: z.string().optional(),

    // Media
    coverImage: z.string(),
    coverImageAlt: z.string(),
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .optional(),
    photoCount: z.number().optional(),

    // Summary on index card + meta
    summary: z.string(),
    lede: z.string().optional(),

    // Megler (responsible broker)
    megler: z.object({
      name: z.string(),
      role: z.string(),
      avatar: z.string(),
      email: z.string(),
      phone: z.string(),
      slug: z.string().optional(),
    }),

    // Optional structured detail-page data
    facts: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .optional(),
    tenants: z
      .array(
        z.object({
          name: z.string(),
          sector: z.string(),
          etasjer: z.string(),
          areal: z.number(),
          leieKrM2: z.number().optional(),
          leieArlig: z.number(),
          leieArligEstimat: z.boolean().default(false),
          kontraktTil: z.string().optional(),
          andel: z.number(),
          ledig: z.boolean().default(false),
        }),
      )
      .optional(),
    tenantsNote: z.string().optional(),
    financials: z
      .object({
        bruttoLeie: z.number(),
        eierkostnader: z.number(),
        noi: z.number(),
        yieldNetto: z.number(),
        intro: z.string().optional(),
      })
      .optional(),
    location: z
      .object({
        title: z.string(),
        titleTail: z.string(),
        body: z.string(),
        // Real WGS-84 coordinates for the Leaflet marker. Optional — when
        // omitted, the detail page falls back to a centroid of the city.
        geo: z
          .object({ lat: z.number(), lng: z.number() })
          .optional(),
        pois: z.array(
          z.object({ name: z.string(), distance: z.string() }),
        ),
      })
      .optional(),
    downloads: z
      .array(
        z.object({
          label: z.string(),
          sub: z.string(),
          kind: z.enum(["pdf", "nda"]),
          href: z.string(),
        }),
      )
      .optional(),

    slug: z.string().optional(),
  }),
  transform: async (document, context) => {
    try {
      const mdx = await compileMDX(context, document, {
        rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
        remarkPlugins: [remarkGfm],
      });
      const slugger = new GithubSlugger();
      return {
        ...document,
        slug: document.slug || slugger.slug(document.title),
        mdx,
      };
    } catch (error) {
      console.error("Error compiling MDX for:", document.title, error);
      console.error("Error details:", error.stack);
      throw error;
    }
  },
});

export default defineConfig({
  collections: [
    BlogPost,
    ChangelogPost,
    CustomersPost,
    HelpPost,
    LegalPost,
    IntegrationsPost,
    PersonPost,
    LocationPost,
    ListingPost,
  ],
});
