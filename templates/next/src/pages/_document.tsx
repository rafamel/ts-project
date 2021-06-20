import Document, { Html, Head, Main, NextScript } from 'next/document';
import result from '../vendor/meta.json';

class AppDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang={result.manifest.lang.split('-')[0]}>
        <Head>
          <meta charSet="utf-8" />
          {result.head.meta.map((props, i) => (
            <meta key={i} {...props} />
          ))}
          {result.head.link.map((props, i) => (
            <link key={i} {...props} />
          ))}
          <noscript>You need to enable JavaScript to run this app.</noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
