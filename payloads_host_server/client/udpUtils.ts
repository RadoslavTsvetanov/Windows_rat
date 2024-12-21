import * as dgram from "dgram";

export function sendUdpReq(
  message: object,
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
