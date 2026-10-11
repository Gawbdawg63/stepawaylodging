import Script from "next/script";

// Live chat widget (tawk.to — free). To turn it on, paste the embed src that
// tawk.to gives you here. Find it in the tawk.to dashboard under:
//   Administration → Channels → Chat Widget → "Widget Code"
// It looks like:  https://embed.tawk.to/XXXXXXXXXXXXXXXX/1abcd2efg
// (the long number is your Property ID, the short code is the Widget ID.)
// Until this is filled in, the chat bubble simply doesn't render.
const TAWK_SRC = "https://embed.tawk.to/6acc2002cf6c7734c8d62b8a/1k4mlq2nh";

export default function TawkChat() {
  if (!TAWK_SRC) return null;
  return (
    <Script id="tawk-to" strategy="afterInteractive">
      {`var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();
(function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;s1.src='${TAWK_SRC}';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);})();`}
    </Script>
  );
}
