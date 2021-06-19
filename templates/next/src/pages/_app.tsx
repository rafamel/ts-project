import { AppProps } from 'next/app';
import reportWebVitals from '../utils/report-web-vitals';
import '../styles/globals.scss';

// TODO: to start measuring performance, pass a function
// to log results (ex. `reportWebVitals(console.log)`)
if (typeof window !== 'undefined') reportWebVitals();

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return <Component {...pageProps} />;
};

export default App;
