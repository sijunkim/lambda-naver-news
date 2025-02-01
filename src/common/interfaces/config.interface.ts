export interface ConfigInterface<T> {
  getConfig(): T;
  validateConfig(): void;
}
