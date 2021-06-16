import { Serial } from 'type-core';
import { deep } from 'merge-strategies';

export function reconfigureEslintNext(eslint: Serial.Object): Serial.Object {
  return deep(eslint, {
    ...eslint,
    extends: ['plugin:@next/next/recommended'],
    rules: {
      'jsx-a11y/alt-text': [1, { elements: ['img'], img: ['Image'] }]
    }
  });
}
