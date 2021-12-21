export interface Contact {
    image: string;
    username: string;
    lastMessage: string;
    lastMessageTime: Date;
    newMessagesCount: number;
}

export interface MessageMedia {
    uri: string;
    width: number;
    height: number;
}

export interface Message {
    id?: string;
    text: string;
    media?: MessageMedia;
    isSender: boolean;
    time: Date;
    reply?: Message;
    lastOfGroup?: boolean;
    new?: boolean;
    focused?: boolean;
}

export interface Profile {
    username: string;
    name: string;
    image: string;
    description: string;
    followers: number;
    following: number;
    verified: boolean;
}

export interface DerivedAuthentication {
    accessSignature: string;
    derivedJwt: string;
    derivedPublicKey: string;
    compressedDerivedPublicKey: string;
    derivedSeedHex: string;
    expirationBlock: number;
    jwt: string;
    publicKey: string;
}
