import { ReportHandler } from 'web-vitals';

export default function reportWebVitals(handler?: ReportHandler): void {
  if (!handler) return;

  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(handler);
    getFID(handler);
    getFCP(handler);
    getLCP(handler);
    getTTFB(handler);
  });
}
