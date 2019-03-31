/* eslint-disable no-restricted-globals */
import config from '~/config';
import logger from './logger';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

function checkValidSW(swUrl: string): void {
  // Check if the SW can be found. Otherwise reload the page.
  // eslint-disable-next-line
  fetch(swUrl)
    .then((response) => {
      // Ensure SW exists and we're getting a JS file.
      if (
        response.status === 404 ||
        (response.headers.get('content-type') || '').indexOf('javascript') ===
          -1
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      logger.info(
        'SW: No internet connection found. App is running in offline mode.'
      );
    });
}

function registerValidSW(swUrl: string): void {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // The old content has been purged and
              // the fresh content will have been added to the cache.
              logger.info(
                `SW: There's a new version available. Please refresh.`
              );
            } else {
              // Everything has been precached.
              logger.info('SW: Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch((error) => {
      logger.error('SW: Error during service worker registration', error);
    });
}

function register(): void {
  if (!('serviceWorker' in navigator)) {
    return logger.debug('SW: Unsupported');
  }

  logger.debug('SW: Registering');
  // The URL constructor is available in all browsers that support SW.
  const publicUrl = new URL(config.get('publicUrl'), window.location as any);
  // SW won't work if PUBLIC_URL is on a different
  // origin (if a CDN is used to serve assets):
  // https://bit.ly/2GQ8yaT
  if (publicUrl.origin !== window.location.origin) {
    logger.warn('SW: Public url origin is not the same as location origin.');
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = new URL('/service-worker.js', publicUrl).href;
    if (isLocalhost) {
      // Running on localhost: check if a SW still exists or not.
      logger.debug('SW: Location is localhost');
      checkValidSW(swUrl);
      // Add some additional logging to localhost, pointing developers to the
      // service worker/PWA documentation.
      navigator.serviceWorker.ready.then(() => {
        logger.info('SW: This web app served cache-first by a service worker');
      });
    } else {
      // Is not local host. Just register service worker
      registerValidSW(swUrl);
    }
  });
}

function unregister(): void {
  logger.debug('SW: Disabled.');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      logger.debug('SW: Unregistered.');
      registration.unregister();
    });
  }
}

export default { register, unregister };
