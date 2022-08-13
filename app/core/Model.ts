import { ObjectId, WithId, Document } from 'mongodb';
import { CommentType, MessageType, UserType } from '../types/types.js';
import DataBase from './DataBase.js';

class Model extends DataBase {
  protected collection: string;

  protected constructor(collection: string) {
    super();
    this.collection = collection;
  }

  public find() {
    return new Promise((resolve, reject) => {
      this.mongoClient.connect(async (err, client) => {
        if (err) return reject(err);
        const db = client?.db(this.dbname);
        const rawData = db?.collection(this.collection)?.find();
        const data = await rawData?.toArray();
        return resolve(data);
      });
    });
  }

  public findOne(id: string) {
    return new Promise((resolve, reject) => {
      this.mongoClient.connect(async (err, client) => {
        if (err) return reject(err);
        const db = client?.db(this.dbname);
        return db?.collection(this.collection)?.findOne({
          _id: new ObjectId(id),
        }, (error, res) => {
          if (error) return reject(error);
          return resolve(res);
        });
      });
    });
  }

  public create(data: UserType | MessageType | CommentType): Promise<undefined | string> {
    return new Promise((resolve, reject) => {
      this.mongoClient.connect((err, client) => {
        if (err) return reject(err);
        const db = client?.db(this.dbname);
        return db?.collection(this.collection)?.insertOne(data, (error, res) => {
          if (error) return reject(error);
          if (!res?.insertedId) return reject(new Error());
          return resolve(res.insertedId.toString());
        });
      });
    });
  }

  public findBySecretId(secretId: string): Promise<WithId<Document>[] | undefined | null> {
    return new Promise((resolve, reject) => {
      this.mongoClient.connect(async (err, client) => {
        if (err) return reject(err);
        const db = client?.db(this.dbname);
        const rawData = db?.collection(this.collection)?.find({
          forUserSecretId: secretId,
        });
        const data = await rawData?.toArray();
        return resolve(data);
      });
    });
  }

  public findOneBySecretId(secretId: string): Promise<WithId<Document> | undefined | null> {
    return new Promise((resolve, reject) => {
      this.mongoClient.connect(async (err, client) => {
        if (err) return reject(err);
        const db = client?.db(this.dbname);
        return db?.collection(this.collection)?.findOne({
          forUserSecretId: secretId,
        }, (error, res) => {
          if (error) return reject(error);
          return resolve(res);
        });
      });
    });
  }
}

export default Model;
