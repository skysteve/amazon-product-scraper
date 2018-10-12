import config from 'config';
import mongoose from 'mongoose';
import { AddressInfo } from 'net';

import createServer from './server';

/**
 * Connect to the mongodb server
 * This basically just wraps up the mongoose connection in a promise
 * to make it easier to manage
 */
function connectToMongo(): Promise<void> {
  return new Promise((resolve, reject) => {
    mongoose.connect(config.get('mongodb.connectionString'));

    const db = mongoose.connection;
    db.on('error', reject);
    db.once('open', () => {
      return resolve();
    });
  });
}

Promise.all([
  connectToMongo(),
  createServer()
])
  .then((results) => {
    const app = results[1];
    const listener = app.listen(9876, () => {
      // tslint:disable-next-line:no-console
      console.log(`Server started on port ${(listener.address() as AddressInfo).port}`);
    });
  })
  .catch ((e) => {
    // tslint:disable-next-line:no-console
    console.error(e);
  });
