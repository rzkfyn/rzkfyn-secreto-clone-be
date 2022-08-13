import { Router } from 'express';
import CommentController from '../app/controllers/CommentController.js';
import MessageController from '../app/controllers/MessageController.js';
import UserController from '../app/controllers/UserController.js';

const router = Router();

router.get('/', (_, res) => {
  return res.status(200).json({
    status: 'Ok',
    message: 'Made by rzkfyn with <3',
  });
});

router.post('/user/register', UserController.register);

router.post('/user/validate', UserController.validate);

router.post('/user/isAuthorized', UserController.isAuthorized);

router.get('/user/:secretId', UserController.show);

router.post('/message', MessageController.sendMessage);

router.get('/messages/:userSecretId', MessageController.getByUserSecretId);

router.post('/comment', CommentController.sendComment);

// router.get('/comments/:userSecretId', CommentController.getByUserSecretId);

router.use('/', (_, res) => {
  return res.status(404).json({
    status: 'Error',
    message: 'There\'s nothing here ;_;',
  });
});

export default router;
