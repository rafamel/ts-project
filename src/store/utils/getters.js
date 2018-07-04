export default function getters(fn) {
  return (self) => {
    const obj = fn(self);
    return Object.defineProperties(
      {},
      Object.keys(obj).reduce((acc, key) => {
        acc[key] = { get: obj[key], enumerable: true };
        return acc;
      }, {})
    );
  };
}
