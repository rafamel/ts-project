export default new Proxy(
  {},
  {
    get(_target, property) {
      return 'class-' + String(property);
    }
  }
);
