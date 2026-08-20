const storage: Record<string, string> = {};

const mockAsyncStorage = {
  setItem: jest.fn((key: string, value: string) => {
    return new Promise((resolve) => {
      storage[key] = value;
      resolve(null);
    });
  }),
  getItem: jest.fn((key: string) => {
    return new Promise((resolve) => {
      resolve(storage[key] || null);
    });
  }),
  removeItem: jest.fn((key: string) => {
    return new Promise((resolve) => {
      delete storage[key];
      resolve(null);
    });
  }),
  multiRemove: jest.fn((keys: string[]) => {
    return new Promise((resolve) => {
      keys.forEach((key) => delete storage[key]);
      resolve(null);
    });
  }),
  clear: jest.fn(() => {
    return new Promise((resolve) => {
      Object.keys(storage).forEach((key) => delete storage[key]);
      resolve(null);
    });
  }),
};

export default mockAsyncStorage;
