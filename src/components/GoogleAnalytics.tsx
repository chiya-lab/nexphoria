"use client";

/**
 * GoogleAnalytics — injects the GA4 gtag.js script + config into <head>.
 * Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID is empty.
 *
 * Usage: add <GoogleAnalytics /> anywhere in the root layout (inside <head>
 * or directly in <body>; Next.js Script handles placement).
 */

import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {/* Load the gtag.js library — analytics is low-priority, defer to browser idle */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      {/* Bootstrap dataLayer + configure GA4. gtag() calls queue in dataLayer
          until the library loads, so lazyOnload here is safe. */}
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
            send_page_view: true,
            cookie_flags: 'SameSite=None;Secure',
          });
        `}
      </Script>
    </>
  );
}
