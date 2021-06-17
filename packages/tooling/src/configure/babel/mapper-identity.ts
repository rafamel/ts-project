export default new Proxy(
  {},
  {
    get(_target, property) {
      return String(property);
    }
  }
);
