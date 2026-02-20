"use client";

import { RiLinkedinFill, RiTwitterXFill, RiLink, RiCheckLine } from "@remixicon/react";
import { useState } from "react";

import { cx } from "@/lib/utils";

interface SocialShareProps {
  title: string;
  url: string;
  summary?: string;
}

export default function SocialShare({ title, url, summary }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : url;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedSummary = summary ? encodeURIComponent(summary) : "";

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-warm-grey/60 dark:text-warm-white/60">
        <span className="text-sm font-medium">Del artikkel</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={shareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className={cx(
            "flex items-center justify-center gap-2 rounded-full border border-warm-grey/20 bg-warm-grey/10 px-4 py-2 text-sm font-medium text-warm-grey/80 transition-all dark:border-warm-grey-2/20 dark:bg-warm-grey-2/10 dark:text-warm-white/80",
            "hover:border-warm-grey/30 hover:bg-warm-grey/15 hover:text-warm-grey dark:hover:border-warm-grey-2/30 dark:hover:bg-warm-grey-2/20 dark:hover:text-warm-white"
          )}
          aria-label="Del på Twitter/X"
        >
          <RiTwitterXFill className="h-4 w-4" />
          <span className="hidden sm:inline">Twitter</span>
        </a>
        <a
          href={shareLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={cx(
            "flex items-center justify-center gap-2 rounded-full border border-warm-grey/20 bg-warm-grey/10 px-4 py-2 text-sm font-medium text-warm-grey/80 transition-all dark:border-warm-grey-2/20 dark:bg-warm-grey-2/10 dark:text-warm-white/80",
            "hover:border-warm-grey/30 hover:bg-warm-grey/15 hover:text-warm-grey dark:hover:border-warm-grey-2/30 dark:hover:bg-warm-grey-2/20 dark:hover:text-warm-white"
          )}
          aria-label="Del på LinkedIn"
        >
          <RiLinkedinFill className="h-4 w-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </a>
        <button
          onClick={handleCopyLink}
          className={cx(
            "flex items-center justify-center gap-2 rounded-full border border-warm-grey/20 bg-warm-grey/10 px-4 py-2 text-sm font-medium text-warm-grey/80 transition-all dark:border-warm-grey-2/20 dark:bg-warm-grey-2/10 dark:text-warm-white/80",
            "hover:border-warm-grey/30 hover:bg-warm-grey/15 hover:text-warm-grey dark:hover:border-warm-grey-2/30 dark:hover:bg-warm-grey-2/20 dark:hover:text-warm-white"
          )}
          aria-label="Kopier lenke"
        >
          {copied ? (
            <>
              <RiCheckLine className="h-4 w-4" />
              <span className="hidden sm:inline">Kopiert!</span>
            </>
          ) : (
            <>
              <RiLink className="h-4 w-4" />
              <span className="hidden sm:inline">Kopier lenke</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
