import { ObjectId } from 'mongodb';
import Model from '../core/Model.js';
import { CommentType, MessageType } from '../types/types.js';

class Message extends Model {
  public constructor() {
    super('messages');
  }

  // eslint-disable-next-line class-methods-use-this
  public joinMessagesWithComments(messages: MessageType[], comments: CommentType[]) {
    const result: {
      _id: ObjectId;
      forUserSecretId: string;
      text: string;
      sentAt: string;
      comments: CommentType[];
    }[] = [];

    messages.forEach((message) => {
      const messageComments: CommentType[] = [];
      comments.forEach((comment) => {
        if (message._id.toString() === comment.forMessageId.toString()) {
          messageComments.push(comment);
        }
      });
      result.push({
        ...message,
        comments: messageComments,
      });
    });

    return result;
  }
}

export default Message;
