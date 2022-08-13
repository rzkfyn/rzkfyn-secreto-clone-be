import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

class DataBase {
  protected mongoClient: MongoClient;
  protected dbname = process.env.DBNAME as string;
  protected mongoconstr = process.env.MONGODBCONSTR as string;

  protected constructor() {
    this.mongoClient = new MongoClient(this.mongoconstr, { serverApi: ServerApiVersion.v1 });
  }
}

export default DataBase;
