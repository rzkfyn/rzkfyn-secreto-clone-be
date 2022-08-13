import { Request, Response } from 'express';
import Controller from '../core/Controller.js';
import { CommentType, MessageType, UserType } from '../types/types.js';

class MessageController extends Controller {
  public static async sendMessage(req: Request, res: Response) {
    const { text, forUserSecretId } = req.body;
    console.log(req.body);
    const sentAt = new Date().toISOString();
    const message = {
      text, forUserSecretId, sentAt,
    } as MessageType;

    let user: UserType | undefined | null;
    try {
      user = await MessageController.model('user')?.findOneBySecretId(forUserSecretId) as UserType;
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }

    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }

    let insertedId: string | undefined;
    try {
      insertedId = await MessageController.model('message')?.create(message);
      if (!insertedId) throw new Error();
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }

    return res.status(201).json({
      status: 'Ok',
      data: {
        insertedId,
      },
    });
  }

  public static async getByUserSecretId(req: Request, res: Response) {
    const { userSecretId } = req.params;

    let user: UserType | undefined | null;
    try {
      user = await MessageController.model('user')?.findOneBySecretId(userSecretId) as UserType;
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }

    if (!user) {
      return res.status(404).json({
        status: 'Error',
        message: 'User not found',
      });
    }

    let messages: MessageType[] | undefined | null;
    let comments: CommentType[] | undefined | null;

    try {
      messages = await MessageController.model('message')?.findBySecretId(userSecretId) as MessageType[] | undefined | null;
      comments = await MessageController.model('comment')?.findBySecretId(userSecretId) as CommentType[] | undefined | null;
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }

    // @ts-ignore
    const messagesWithComments = MessageController.model('message')?.joinMessagesWithComments(messages, comments);

    return res.status(200).json({
      status: 'Ok',
      data: {
        messages: messagesWithComments,
      },
    });
  }
}

export default MessageController;
