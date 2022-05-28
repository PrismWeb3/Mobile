export interface Contact {
  imageURL: string;
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
  imageURL: string;
  bio: string;
  followers: number;
  following: number;
  verified: boolean;
}

export interface DatabaseUser {
  _id: string;
  username: string;
  userPublicKey: string;
  bio: string;
  name: string;
  avatarHash: string;
  connections: {
    eth: {
      address: string;
      proofHash: string;
    } | null;
    deso: {
      address: string;
      proofHash: string;
    } | null;
  } | null;
  clients: [
    {
      _id: string;
      name: string;
      clientPublicKey: string;
      paperKey: boolean;
      createdAt: number;
    },
  ];
  createdAt: number;
  tempKeys: [{
    publicKey: string;
    expiresAt: number;
    signedBy: string;
  }] | [];
  chain: [];
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
