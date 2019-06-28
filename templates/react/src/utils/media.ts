import media from '@1natsu/handy-media-query';
import config from '~/config';

export default {
  ...media,
  breakpoint(point: 'xs' | 'sm' | 'md' | 'lg' | 'xl') {
    return media.min(config.get('breakpoints.' + point) + 'px');
  }
};
