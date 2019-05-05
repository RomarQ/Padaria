export interface CryptoInterface {
    /*
    *   States
    */
    keys: KeysType;
    /*
    *   Functions
    */
    mnemonicToSeed: (mnemonic:string, passphrase:string) => Buffer;
    isEdesk: (secret:string) => boolean;
    isEdsk: (secret:string) => boolean;
    seedToKeys: (seed:Uint8Array) => KeysType;
    encryptSK: (keys:KeysType, passphrase:string) => KeysType;
    decryptSK: (keys:KeysType, passphrase:string) => KeysType;
    getKeysFromMnemonic: (mnemonic: string, passphrase: string) => KeysType;
    getKeysFromEncSeed: (esk_encoded:string, password:string) => Promise<KeysType>;
    getKeysFromDecSecret: (sk_or_seed:string) => KeysType;
    sign: (bytes:string, sk:string, watermark?:Uint8Array) => SignatureProps;
    generateMnemonic: () => string;
    checkAddress: (address:string) => boolean;
    checkHash: (buffer:Uint8Array) => boolean;
    stampCheck: (hash:Uint8Array) => number;
    seedHash: (seed:string) => Uint8Array;
    hexNonce: (size:number) => string;
    nonceHash: (nonce:Uint8Array) => string;
    POW: (forged:string, priority:number, seedHex:string) => Promise<{blockbytes:string, att:number}>;
};

export type signatureProps = {
    sig: string;
    edsig: string;
    signedBytes: string;
};