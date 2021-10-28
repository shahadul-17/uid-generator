export interface IUIDGenerator {

  /**
   * Retrieves last generated UID.
   * @returns Returns last generated UID.
   */
  getLast(): string;

  /**
   * Sets last generated UID.
   */
  setLast(uid: string): void;

  /**
   * Generates new UID.
   * @returns Returns newly generated UID.
   */
  generate(): string;
}
