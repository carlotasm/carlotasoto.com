"use client";

import Script from "next/script";

export function TallyEmbed({ src }: { src: string }) {
  return (
    <>
      <iframe
        data-tally-src={src}
        loading="lazy"
        width="100%"
        height="400"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="Artwork Inquiries"
      />
      <Script
        id="tally-js"
        src="https://tally.so/widgets/embed.js"
        onLoad={() => {
          if (typeof (window as any).Tally !== "undefined") {
            (window as any).Tally.loadEmbeds();
          }
        }}
      />
    </>
  );
}
