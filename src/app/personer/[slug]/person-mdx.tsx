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

// Plain elements so the editorial `.pe-main` typography from the design
// stylesheet applies (h2 / p / ul styling defined globally).
const components = {
  a: (props: any) => <CustomLink {...props} />,
};

interface PersonMDXProps {
  code: string;
}

export function PersonMDX({ code }: PersonMDXProps) {
  return <MDXContent code={code} components={components} />;
}
