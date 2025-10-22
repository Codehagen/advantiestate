"use client";

import { MDXContent } from "@content-collections/mdx/react";
import Link from "next/link";

const CustomLink = (props: any) => {
  const href = props.href;

  if (href.startsWith("/")) {
    return (
      <Link {...props} href={href}>
        {props.children}
      </Link>
    );
  }

  if (href.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

const components = {
  h2: (props: any) => (
    <h2
      className="mb-4 mt-8 text-2xl font-semibold text-warm-grey dark:text-warm-white"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="mb-3 mt-6 text-xl font-medium text-warm-grey dark:text-warm-white"
      {...props}
    />
  ),
  a: (props: any) => (
    <CustomLink
      className="font-medium text-warm-grey-2 underline underline-offset-4 hover:text-warm-grey dark:text-warm-grey-1 dark:hover:text-warm-white"
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      className="my-4 text-base leading-relaxed text-warm-grey-2 dark:text-warm-grey-1"
      {...props}
    />
  ),
  li: (props: any) => (
    <li
      className="mb-2 text-base leading-relaxed text-warm-grey-2 dark:text-warm-grey-1"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul className="my-2 list-disc space-y-2 pl-6" {...props} />
  ),
  ol: (props: any) => (
    <ol className="my-2 list-decimal space-y-2 pl-6" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-semibold text-warm-grey dark:text-warm-white" {...props} />
  ),
};

interface PersonMDXProps {
  code: string;
}

export function PersonMDX({ code }: PersonMDXProps) {
  return (
    <article className="prose prose-lg max-w-none dark:prose-invert">
      <MDXContent code={code} components={components} />
    </article>
  );
}
