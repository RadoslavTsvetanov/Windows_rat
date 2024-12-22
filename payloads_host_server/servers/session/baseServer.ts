import * as dgram from "dgram";

// Utility function to check if a value is defined
function isSomething(v: any): boolean {
  return v !== undefined && v !== null;
}

function sendResponse(
  server: dgram.Socket,
  rinfo: dgram.RemoteInfo,
  response: Response
): void {
  let retries = 0;
  const maxRetries = 3;

  const send = () => {
    setTimeout(() => {
      server.send(
        JSON.stringify(response),
        rinfo.port,
        rinfo.address,
        (error) => {
          if (error) {
            console.error("Error sending response:", error);
            retries = maxRetries; // stop retrying if there's an error
          } else {
            console.log(`Response sent to ${rinfo.address}:${rinfo.port}`);
          }
        }
      );
    }, 100 * retries);

    retries += 1;
    if (retries <= maxRetries) {
      send(); // Retry sending the response if maxRetries is not reached
    }
  };

  send(); // Start the process
}

// Enum for response statuses
export enum ResponseStatuses {
  Successful = "succesfully_handled_req", // Random number, no real reasoning
  CouldntFindHandler = "couldnt handle this type of req",
  MalformedReq = "malformed_req",
}

// Request interface with generic payload
export interface Request<T = object> {
  handlerId: string;
  payload: T;
}

// Response interface with generic payload
interface Response<T = object> {
  status: ResponseStatuses;
  payload: T;
}

// UDP server class
export class UDP {
  private handlers: Record<string, (payload: any) => Promise<Response>> = {};

  addHandler<payloadType>(
    identifier: string,
    handler: (payload: payloadType) => Promise<Response>
  ): UDP {
    this.handlers[identifier] = handler;
    return this
  }

  // Method to start listening for incoming UDP messages
  listen(port: number): void {
    const server = dgram.createSocket("udp4");

    server.on("message", async (msg, rinfo) => {
      console.log(
        `Server received: ${msg} from ${rinfo.address}:${rinfo.port}`
      );

      // TODO: Add encryption and decryption

      try {
        const req = JSON.parse(msg.toString()) as Request;

        if (!isSomething(req.handlerId) || !isSomething(req.payload)) {
          sendResponse(server, rinfo, {
            status: ResponseStatuses.MalformedReq,
            payload: {},
          });
          return;
        }

        // Check if the handler exists for the request
        if (this.handlers[req.handlerId]) {
          const response = await this.handlers[req.handlerId](req.payload);
          sendResponse(server, rinfo, response);
        } else {
          sendResponse(server, rinfo, {
            status: ResponseStatuses.CouldntFindHandler,
            payload: {},
          });
        }
      } catch (e) {
        sendResponse(server, rinfo, {
          status: ResponseStatuses.MalformedReq,
          payload: {},
        });
      }
    });

    // Handle server errors
    server.on("error", (err) => {
      console.error("Server error:", err);
      server.close();
    });

    // Log when the server starts listening
    server.on("listening", () => {
      const address = server.address();
      console.log(`Server listening on ${address.address}:${address.port}`);
    });

    // Start the server on a specific port (example: 41234)
    server.bind(port);
  }
}




