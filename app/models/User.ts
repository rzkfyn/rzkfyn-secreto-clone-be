import { WithId, Document } from 'mongodb';
import Model from '../core/Model.js';

class User extends Model {
  public constructor() {
    super('users');
  }

  /**
   * @override
   */
  public findOneBySecretId(secretId: string): Promise<WithId<Document> | undefined | null> {
    return new Promise((resolve, reject) => {
      this.mongoClient.connect(async (err, client) => {
        if (err) return reject(err);
        const db = client?.db(this.dbname);
        return db?.collection(this.collection)?.findOne({
          secretId,
        }, (error, res) => {
          if (error) return reject(error);
          return resolve(res);
        });
      });
    });
  }
}

export default User;
