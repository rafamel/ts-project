/* eslint-disable @next/next/no-img-element */
import { ReactNode } from 'react';
import Head from 'next/head';
import PureLink from './PureLink';
import styles from './Layout.module.scss';
import vercelImg from '../assets/vercel.svg';
import meta from '../vendor/meta.json';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = (props: Props): JSX.Element => {
  const title =
    props.title || `${meta.manifest.name} - ${meta.manifest.description}`;

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {meta.head.meta.map((props, i) => (
          <meta key={i} {...props} />
        ))}
        {meta.head.link.map((props, i) => (
          <link key={i} {...props} />
        ))}
      </Head>
      <header>
        <nav>
          <PureLink href="/" text="Home" /> |{' '}
          <PureLink href="/about" text="About" /> |{' '}
          <PureLink href="/users" text="Users Lists" /> |{' '}
          <PureLink href="/api/users" text="Users API" />
        </nav>
      </header>
      {props.children}
      <footer className={styles.footer}>
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          Powered by{' '}
          <img src={vercelImg.src} alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
};

export default Layout;
