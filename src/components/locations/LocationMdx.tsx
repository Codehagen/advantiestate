"use client";

import { MDXContent } from "@content-collections/mdx/react";
import Link from "next/link";
import { cx } from "@/lib/utils";

const CustomLink = (props: any) => {
  const href = props.href as string;

  if (href?.startsWith("/")) {
    return (
      <Link {...props} href={href}>
        {props.children}
      </Link>
    );
  }

  if (href?.startsWith("#")) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
};

const components = {
  a: (props: any) => (
    <CustomLink
      {...props}
      className={cx(
        "text-warm-grey underline underline-offset-4 transition hover:text-warm-grey-3",
        props.className,
      )}
    />
  ),
  h2: (props: any) => (
    <h2
      {...props}
      className={cx(
        "mt-10 text-2xl font-semibold tracking-tight text-warm-grey dark:text-warm-white",
        props.className,
      )}
    />
  ),
  h3: (props: any) => (
    <h3
      {...props}
      className={cx(
        "mt-8 text-xl font-semibold tracking-tight text-warm-grey dark:text-warm-white",
        props.className,
      )}
    />
  ),
  p: (props: any) => (
    <p
      {...props}
      className={cx(
        "mt-4 text-base leading-7 text-warm-grey-2 dark:text-warm-grey-1",
        props.className,
      )}
    />
  ),
  ul: (props: any) => (
    <ul
      {...props}
      className={cx(
        "mt-4 list-disc space-y-2 pl-6 text-warm-grey-2 dark:text-warm-grey-1",
        props.className,
      )}
    />
  ),
  li: (props: any) => (
    <li {...props} className={cx("leading-7", props.className)} />
  ),
};

export function LocationMdx({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <div className={cx("prose max-w-none", className)}>
      <MDXContent code={code} components={components} />
    </div>
  );
}
