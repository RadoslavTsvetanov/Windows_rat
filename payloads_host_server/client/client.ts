import { messages } from './../servers/session/types';
import { sendUdpReq } from "./udpUtils";

class ContextSafeType<T>{
    public value: T 
    constructor(private v: T) {
        this.value = v;
    }

    public getValue(): T {
        return this.v;
    }
}

class Url extends ContextSafeType<string>{
    constructor(v: string) {
        super(v);
    }
}


interface Env{
    port: number,
    host: string
}

class Client{
    private env: Env;
    
    constructor(env: Env) {
        this.env = env;
    }

    async startSession() {
        return await sendUdpReq({handlerId: messages.start_session.toString(), payload: {}} , this.env.port, this.env.host)
    
    }
}

console.log("uihfedv",await new Client({port: 41234, host: "127.0.0.1"}).startSession())