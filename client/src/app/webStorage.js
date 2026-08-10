// redux-persist/lib/storage is CommonJS and its default export doesn't survive
// Vite 8's rolldown CJS interop (storage.getItem ends up undefined at runtime),
// so we implement the same { getItem, setItem, removeItem } contract directly.
const webStorage = {
  getItem(key) {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem(key, value) {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem(key) {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

export default webStorage;
