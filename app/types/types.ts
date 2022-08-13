import { ObjectId } from 'mongodb';

declare type UserType = {
  _id: ObjectId;
  secretId: string;
  name: string;
  registeredAt: string;
};

declare type MessageType = {
  _id: ObjectId;
  forUserSecretId: string;
  text: string;
  sentAt: string;
}

declare type CommentType = {
  _id: ObjectId;
  forUserSecretId: string;
  forMessageId: ObjectId;
  text: string;
  sentAt: string;
}

export {
  UserType, MessageType, CommentType,
};
