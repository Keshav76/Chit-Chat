export const getKeys = async () => {
  const keys = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  return {
    publicKey: JSON.stringify(
      await window.crypto.subtle.exportKey("jwk", keys.publicKey)
    ),
    privateKey: JSON.stringify(
      await window.crypto.subtle.exportKey("jwk", keys.privateKey)
    ),
  };
};

const encrypt = async (data: string, key: CryptoKey) => {
  return await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    Encoder.encode(data)
  );
};

const decrypt = async (data: Uint8Array, key: CryptoKey) => {
  const res = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    data
  );
  const dec = new TextDecoder();
  return dec.decode(res);
};

const Encoder = new TextEncoder();

export const encryptData = async (data: string, key: string) => {
  let publicKey = await window.crypto.subtle.importKey(
    "jwk",
    JSON.parse(key),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );

  let cipher = await encrypt(data, publicKey);
  return btoa(String.fromCharCode(...new Uint8Array(cipher)));
};

export const decryptData = async (data: string, key: string) => {
  let publicKey = await window.crypto.subtle.importKey(
    "jwk",
    JSON.parse(key),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
  let val = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
  return await decrypt(val, publicKey);
};
