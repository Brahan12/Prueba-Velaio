export class encript {
  public encrypt(data: any): string {
    const jsonString = JSON.stringify(data);
    const utf8Encoded = encodeURIComponent(jsonString);
    const encryptedString = btoa(utf8Encoded);
    return encryptedString;
  }

  public decrypt(data: string): any {
    const utf8Decoded = decodeURIComponent(atob(data));
    const decryptedData = JSON.parse(utf8Decoded);
    return decryptedData;
  }
}
