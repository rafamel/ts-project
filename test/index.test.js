import main from '../src';

describe(`- Main`, () => {
  test(`Doesn't throw`, () => {
    expect(() => main()).not.toThrow();
  });
});
