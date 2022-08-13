import { Request, Response } from 'express';
import Controller from '../core/Controller.js';
import { CommentType, UserType, MessageType } from '../types/types.js';

class CommentController extends Controller {
  public static async sendComment(req: Request, res: Response) {
    const { text, forUserSecretId, forMessageId } = req.body;

    let user: UserType | undefined;
    try {
      user = await CommentController.model('user')?.findOneBySecretId(forUserSecretId) as UserType;
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

    let message: MessageType | undefined;
    try {
      message = await CommentController.model('message')?.findOne(forMessageId) as MessageType;
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }
    if (!message) {
      return res.status(404).json({
        status: 'Error',
        message: 'Message not found',
      });
    }

    const sentAt = new Date().toISOString();
    const comment = {
      forUserSecretId, forMessageId, text, sentAt,
    } as CommentType;

    let insertedId: string | undefined;
    try {
      insertedId = await CommentController.model('comment')?.create(comment);
      if (!insertedId) throw new Error();
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal sever error',
      });
    }

    return res.status(201).json({
      status: 'Ok',
      data: {
        insertedId,
      },
    });
  }

  // public static async getByUserSecretId(req: Request, res: Response) {
  //   const { userSecretId } = req.params;

  //   let user: UserType | undefined | null;
  //   try {
  //     user = await CommentController.model('user')?.findOneBySecretId(userSecretId) as UserType;
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(500).json({
  //       status: 'Error',
  //       message: 'Internal server error',
  //     });
  //   }

  //   if (!user) {
  //     return res.status(404).json({
  //       status: 'Error',
  //       message: 'User not found',
  //     });
  //   }

  //   let comments: CommentType[] | undefined;
  //   try {
  //     comments = await CommentController.model('comment')?.findBySecretId(userSecretId)
  //     as CommentType[];
  //   } catch (e) {
  //     console.log(e);
  //     return res.status(500).json({
  //       status: 'Error',
  //       message: 'Internal server error',
  //     });
  //   }
  //   console.log(comments);
  //   return res.status(200).json({
  //     status: 'Ok',
  //     data: {
  //       comments,
  //     },
  //   });
  // }
}

export default CommentController;
