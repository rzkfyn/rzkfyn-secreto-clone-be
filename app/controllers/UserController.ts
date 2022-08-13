import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import Controller from '../core/Controller.js';
import { UserType } from '../types/types.js';

class UserController extends Controller {
  public static async register(req: Request, res: Response) {
    const { name } = req.body;
    const secretId = nanoid(12);
    const registeredAt = new Date().toISOString();
    const user = {
      name, secretId, registeredAt,
    } as UserType;

    let insertedId: undefined | string;
    try {
      insertedId = await UserController.model('user')?.create(user);
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
        insertedUser: {
          _id: insertedId,
          name,
          secretId,
        },
      },
    });
  }

  public static async validate(req: Request, res: Response) {
    const { secretId, _id } = req.body;

    let user: UserType | undefined;
    try {
      user = await UserController.model('user')?.findOneBySecretId(secretId) as UserType;
      if (!user || user._id.toString() !== _id) throw new Error();
    } catch (err) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        secretId: user.secretId,
        name: user.name,
      },
    });
  }

  public static async show(req: Request, res: Response) {
    const { secretId } = req.params;
    let user: UserType | undefined;
    try {
      user = await UserController.model('user')?.findOneBySecretId(secretId) as UserType;
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }

    if (!user) {
      return res.status(404).json({
        status: 'Not found',
        message: 'User not found',
      });
    }

    return res.json({
      status: 'Ok',
      data: {
        user: {
          name: user.name,
          secretId: user.secretId,
        },
      },
    });
  }

  public static async isAuthorized(req: Request, res: Response) {
    const {
      targetSecretId,
      name,
      _id,
      secretId,
    } = req.body;

    let userTarget: UserType | undefined;
    try {
      userTarget = await UserController.model('user')?.findOneBySecretId(targetSecretId) as UserType;
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        status: 'Error',
        message: 'Internal server error',
      });
    }

    const isAuthorized = (
      (userTarget?._id.toString() === _id)
      && (userTarget?.name === name)
      && (userTarget?.secretId === secretId)
    );

    return res.status(200).json({
      status: 'Ok',
      data: {
        isAuthorized,
      },
    });
  }
}

export default UserController;
