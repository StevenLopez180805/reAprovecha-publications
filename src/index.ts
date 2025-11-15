import App from "./app";
import { ServerBootstrap } from './bootstrap/server.bootstrap';

const serverBootstrap = new ServerBootstrap(App);

(
  async() => {
    try {
      const instances = [serverBootstrap.initialize()];
      await Promise.all(instances);
    } catch (error) {
      console.log({error});
    }
  }
)();