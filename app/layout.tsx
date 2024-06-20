import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Active Voice Issue Submissions",
  description: "We will consider a maximum of three (3) pieces per person. Simultaneous submissions, as well as pieces that have been published elsewhere, are accepted. Though we would love to share as many youth voices as possible, please note that publication in Active Voice is a selective process (this should not stop you from submitting!).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAWCAQAAACSqI96AAADK0lEQVQ4y7XUW2xTdRwH8O//cs7paXfWlrbQTcYW0SHLYA81W8ZQUYYYgjGCDOYlgcRgeNHENwJeXoxGo/GaGIPRBw2aCUM0jpsRkZkgAglkkl1pQ0uFdaxw1vb0XP5/H5ZtoixBjb+n/8P387/llx/wn4pMLW4Pmvro7wAQi3uReOpKpeEBgrq2yl2m2zZ3OCswlVienwqXmUo+NcMJGyI5t+Vl+souGYYPDIxedDbxr8mwuEss8r9U+Fx7kx8pdld0FndIlZ6TC9z26UsYy7UP6fX5c/TH+GkgWuXbYmyO3cEu14X0R5Vnlc8AfkB7JlrNfwSUD9QXVnBjOQDQSW49wdI0PbbSW4o0kMtan5ifArCS+VI3gCLAvhNt5sNsNwAi15/YrY1M8wYVK+Qg+cVdQ0dEU4O6yNDfA0DgTm4ubMA4KO6Rj0S7ABC6q7TBWjvNLzwHztNMl2v1YfrrQO/wYWED5nYyx3g6oWAdbQnV5vpBUMyMxeLyPvGkusded8PPh5qcJcQmabc2OFSRTK+BWrW/duxkh8cW9Dx+9Y0H3Xot7+/Jr/IVGs/XZz+e6KBd3vTbATJeelcGQkn7bctJHpW615Q6OWK4CbGqKN7Z6iwj+cKrtBAIz5038OLeu4ns8gCATXHrGl8qTGTsOg8y6jx/76HUTvtMpE/vc+737dfL+T2xpD9RGfGcid6Fx7POpGIzHaT6vYfcSuWIqJcR8WVShGMV/eXbot+YzcSUrfMajTpHy2UnjFK89aff5KShM7zysFgmV1f38BOiLRiuSvDB0FFqjG/27ZUlutCruaQnX5/Y6KSi73/71pT50+mFgpKgP4wecwZUIbfxM7Ks5QpPYZ9ezvSzWJHYgWCmvBJ3ljpIn/vzX3r+xqqu8VbrXxWbPYFOMTj+WkK59ED24N9z9Obcb7l+u1kskY1kJzk2d9spx2JblVvmQ6O+czwDIr/PZVtOwWhQlchHzi1zADRw1dHahoGestp9vb3mi5uF2Gw6oDtOxWgmaF4GfIlw71nrH06S6nagdnGrDkQ7Z8vw2Xn5Wl08eT4FQLvyL+bYBja/Bf9v/QGAjkjpNh9HPwAAAABJRU5ErkJggg==" sizes="32x32"/>
        <link rel="icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAWCAQAAACSqI96AAADK0lEQVQ4y7XUW2xTdRwH8O//cs7paXfWlrbQTcYW0SHLYA81W8ZQUYYYgjGCDOYlgcRgeNHENwJeXoxGo/GaGIPRBw2aCUM0jpsRkZkgAglkkl1pQ0uFdaxw1vb0XP5/H5ZtoixBjb+n/8P387/llx/wn4pMLW4Pmvro7wAQi3uReOpKpeEBgrq2yl2m2zZ3OCswlVienwqXmUo+NcMJGyI5t+Vl+souGYYPDIxedDbxr8mwuEss8r9U+Fx7kx8pdld0FndIlZ6TC9z26UsYy7UP6fX5c/TH+GkgWuXbYmyO3cEu14X0R5Vnlc8AfkB7JlrNfwSUD9QXVnBjOQDQSW49wdI0PbbSW4o0kMtan5ifArCS+VI3gCLAvhNt5sNsNwAi15/YrY1M8wYVK+Qg+cVdQ0dEU4O6yNDfA0DgTm4ubMA4KO6Rj0S7ABC6q7TBWjvNLzwHztNMl2v1YfrrQO/wYWED5nYyx3g6oWAdbQnV5vpBUMyMxeLyPvGkusded8PPh5qcJcQmabc2OFSRTK+BWrW/duxkh8cW9Dx+9Y0H3Xot7+/Jr/IVGs/XZz+e6KBd3vTbATJeelcGQkn7bctJHpW615Q6OWK4CbGqKN7Z6iwj+cKrtBAIz5038OLeu4ns8gCATXHrGl8qTGTsOg8y6jx/76HUTvtMpE/vc+737dfL+T2xpD9RGfGcid6Fx7POpGIzHaT6vYfcSuWIqJcR8WVShGMV/eXbot+YzcSUrfMajTpHy2UnjFK89aff5KShM7zysFgmV1f38BOiLRiuSvDB0FFqjG/27ZUlutCruaQnX5/Y6KSi73/71pT50+mFgpKgP4wecwZUIbfxM7Ks5QpPYZ9ezvSzWJHYgWCmvBJ3ljpIn/vzX3r+xqqu8VbrXxWbPYFOMTj+WkK59ED24N9z9Obcb7l+u1kskY1kJzk2d9spx2JblVvmQ6O+czwDIr/PZVtOwWhQlchHzi1zADRw1dHahoGestp9vb3mi5uF2Gw6oDtOxWgmaF4GfIlw71nrH06S6nagdnGrDkQ7Z8vw2Xn5Wl08eT4FQLvyL+bYBja/Bf9v/QGAjkjpNh9HPwAAAABJRU5ErkJggg==" sizes="192x192"/>
        <link rel="apple-touch-icon" href="https://activevoicemag.com/wp-content/uploads/2023/02/screenshot_2023-02-17_at_6.45.51_pm-removebg-preview-1.png?w=180"/>
      </head>
      <body className={inter.className}>
        <main className='w-full px-5 lg:px-[20vw] py-[5vh] 2xl:px-[30vw] m-auto flex min-h-screen flex-col gap-5 items-center  '>
          <section>
            <img className='cover h-2/3' src='/active-voice-header.png'/>
          </section>
          {children}
        </main>
      </body>
    </html>
  );
}
