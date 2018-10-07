import { AddressInfo } from 'net';
import createServer from './server';

createServer()
  .then((app) => {
    const listener = app.listen(9876, () => {
      // tslint:disable-next-line:no-console
      console.log(`Server started on port ${(listener.address() as AddressInfo).port}`);
    });
  })
  .catch ((e) => {
    // tslint:disable-next-line:no-console
    console.error(e);
  });
