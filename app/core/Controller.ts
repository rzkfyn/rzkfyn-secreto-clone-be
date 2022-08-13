import User from '../models/User.js';
import Message from '../models/Message.js';
import Comment from '../models/Comment.js';

class Controller {
  public static models = [User, Message, Comment];

  public static model(modelName: string) {
    let model: User | Message | undefined;
    Controller.models.forEach((Model) => {
      if (Model
        .toString()
        .split(' ')[1]
        .replace('{}', '')
        .toLowerCase() === modelName) {
        model = new Model();
      }
    });
    return model;
  }
}

export default Controller;
