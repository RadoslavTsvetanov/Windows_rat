import { messages } from './../servers/session/main';
import * as dgram from "dgram";
import { type Request } from "../servers/session/baseServer";
/*

TODO: Since udp is a bit unreliable we will implement a retry logic  also 

*/
export function sendUdpReq(
  message: Request,
  port: number,
  host: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const client = dgram.createSocket("udp4");
    client.send(JSON.stringify(message), port, host, (err) => {
      if (err) {
        client.close();
        return reject(err);
      }
      console.log(`Message sent: ${message}`);
    });

    client.on("message", (msg) => {
      resolve(msg.toString());
      client.close();
    });

    client.on("error", (err) => {
      reject(err);
      client.close();
    });
  });
}
