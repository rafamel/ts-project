import Layout from '../components/Layout';
import PureLink from '../components/PureLink';

const IndexPage = (): JSX.Element => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <PureLink href="/about" text="About" />
    </p>
  </Layout>
);

export default IndexPage;
