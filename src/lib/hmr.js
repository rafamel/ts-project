import logger from 'logger';

export default function hmr(render, accept) {
  const alert = (e = {}) => modal(e.message);
  // eslint-disable-next-line no-restricted-globals
  window.addEventListener('error', alert);

  if (typeof accept === 'function') {
    accept(() => {
      try {
        render(require('~/containers/App').default);
        closeModal();
      } catch (e) {
        logger.warn(e);
      }
    });
  }
}

function modal(msg) {
  // eslint-disable-next-line no-undef
  swal({ text: msg || 'Error', icon: 'error', dangerMode: true });
  // eslint-disable-next-line no-restricted-globals
  window.addEventListener('error', alert);
}

function closeModal() {
  try {
    // eslint-disable-next-line no-undef
    swal.close();
  } catch (e) {
    logger.warn(e);
  }
}
