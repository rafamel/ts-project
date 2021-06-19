import Layout from '../components/Layout';
import PureLink from '../components/PureLink';

const AboutPage = (): JSX.Element => (
  <Layout title="About | Next.js + TypeScript Example">
    <h1>About</h1>
    <p>This is the about page</p>
    <p>
      <PureLink href="/" text="Go home" />
    </p>
  </Layout>
);

export default AboutPage;
