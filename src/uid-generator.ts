import { IUIDGenerator } from "./uid-generator.i";

type CharacterIncrementResult = {
  hasCarry: boolean,
  character: string,
};

export class UIDGenerator implements IUIDGenerator {

  private uid: string;
  private maximumUidLength: number;

  /**
   * Initializes UID generator.
   * @param initialUid Initial value of the UID (optional). Default value is "-".
   * @param maximumUidLength Maximum number of characters a UID can have (optional). Default value is 8192.
   */
  private constructor(initialUid?: string, maximumUidLength?: number) {
    this.uid = initialUid ?? UIDGenerator.defaultInitialUid;
    this.maximumUidLength = maximumUidLength ?? UIDGenerator.defaultMaximumUidLength;
  }

  getLast(): string {
    return this.uid;
  }

  setLast(uid: string): void {
    if (typeof uid !== "string" || uid.length === 0) {
      uid = UIDGenerator.defaultInitialUid;
    }

    // we set the UID directly...
    this.uid = uid;
  }

  generate(): string {
    // increments the UID by one...
    this.uid = UIDGenerator.incrementUID(this.uid, this.maximumUidLength);

    // returns last generated UID...
    return this.getLast();
  }

  //#region Private Static

  private static readonly defaultInitialUid = "-";
  private static readonly defaultMaximumUidLength = 8192;

  private static isValidCharacter(characterCode: number): boolean {
    return (characterCode > 47 && characterCode < 58) ||
      (characterCode > 64 && characterCode < 91) ||
      (characterCode > 96 && characterCode < 123);
  }

  private static replaceStringAt(uid: string, index: number, replacementString: string): string {
    return uid.substr(0, index) + replacementString + uid.substr(index + replacementString.length);
  }

  private static incrementCharacter(characterCode: number): CharacterIncrementResult {
    const result: CharacterIncrementResult = {
      hasCarry: false,
      character: '0',
    };

    // incrementing the character...
    characterCode++;

    switch (characterCode) {
      case 58:
        result.character = 'A';

        return result;
      case 91:
        result.character = 'a';

        return result;
      case 123:
        // if the ASCII value of the character is 123,
        // we set 'hasCarry' flag to true...
        result.hasCarry = true;

        break;
      default:
        break;
    }

    // checks if character is invalid...
    if (!this.isValidCharacter(characterCode)) {
      return result;
    }

    result.character = String.fromCharCode(characterCode);

    return result;
  }

  private static incrementUID(currentUid: string, uidLength: number): string {
    let uid = currentUid;

    for (let i = 0; i < uidLength; i++) {
      const characterCode = uid.charCodeAt(i);
      const incrementResult = this.incrementCharacter(characterCode);

      uid = this.replaceStringAt(uid, i, incrementResult.character);

      if (!incrementResult.hasCarry) { break; }
    }

    return uid;
  }

  //#endregion

  /**
   * Creates new instance of UID generator.
   * @param initialUid Initial value of the UID (optional). Default value is "-".
   * @param maximumUidLength Maximum number of characters a UID can have (optional). Default value is 8192.
   * @returns Newly created UID generator.
   */
  static create(initialUid?: string, maximumUidLength?: number): IUIDGenerator {
    return new UIDGenerator(initialUid, maximumUidLength);
  }
}
