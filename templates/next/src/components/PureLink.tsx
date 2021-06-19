import Link, { LinkProps } from 'next/link';
import styles from './PureLink.module.scss';

export interface PureLinkProps extends LinkProps {
  text: string;
}

const PureLink = ({ text, ...props }: PureLinkProps): JSX.Element => (
  <Link {...props}>
    <button className={styles.link}>{text}</button>
  </Link>
);

export default PureLink;
