/* eslint-disable @next/next/no-img-element */
import { ReactNode } from 'react';
import PureLink from '../components/PureLink';
import styles from './Layout.module.scss';
import vercelImg from '../assets/vercel.svg';

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = (props: Props): JSX.Element => {
  return (
    <div>
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
