import { decode as atob, encode as btoa } from "base-64";
import { TextEncoder } from "text-encoding";

export function arrayBufferFromString(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function hash(input: string) {
  const utf8 = new TextEncoder().encode(input);
  return crypto.subtle.digest("SHA-256", utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  });
}

export function importExistingKeypair(encodedJson: string) {
  if (!encodedJson) return null;
  const obj = JSON.parse(atob(encodedJson));
  for (let i = 0; i < 1; i++) {
    const key = i === 0 ? "publicKey" : "privateKey";
    obj[key].algorithm.publicExponent = new Uint8Array(
      Object.values(obj[key].algorithm.publicExponent),
    );
  }
  return obj;
}

export function arrayBufferToString(buf: ArrayBuffer) {
  // You could just leave this as a Uint8Array, but to make TS happy we'll convert it
  return String.fromCharCode.apply(
    null,
    (new Uint8Array(buf) as unknown) as number[],
  );
}

export async function exportRSAKey(key: CryptoKey, type: "public" | "private") {
  const exported = await crypto.subtle.exportKey(
    type === "public" ? "spki" : "pkcs8",
    key,
  );
  const exportedAsString = arrayBufferToString(exported);
  const exportedAsBase64 = btoa(exportedAsString);
  const pemExported = `-----BEGIN ${
    type === "private" ? "PRIVATE" : "PUBLIC"
  } KEY-----\n${exportedAsBase64}\n-----END ${
    type === "private" ? "PRIVATE" : "PUBLIC"
  } KEY-----`;

  return pemExported;
}

export async function signRSA(
  message: string,
  privateKey: CryptoKey,
) {
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    enc.encode(message),
  );
  const encstr = btoa(arrayBufferToString(sig));
  return encstr;
}
