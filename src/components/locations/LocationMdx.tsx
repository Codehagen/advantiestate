"use client";

import { MDXContent } from "@content-collections/mdx/react";
import Link from "next/link";
import React from "react";

const CustomLink = ({
  href,
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"a">) => {
  if (href?.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }

  if (href?.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
};

// Plain elements so the editorial `.ks-prose` typography from the design
// stylesheet applies (h2 / h3 / p / ul styling defined globally).
const components = {
  a: (props: any) => <CustomLink {...props} />,
};

export function LocationMdx({ code }: { code: string }) {
  return <MDXContent code={code} components={components} />;
}
