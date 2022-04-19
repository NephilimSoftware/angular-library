export class SynchronousReadError extends Error {
  public constructor() {
    super('Synchronous read failed. Invalid observable passed in parameter.');
  }
}
