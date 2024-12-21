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
    port: string,
    host: string
}

class Client{
    private env: Env;
    
    constructor(env: Env) {
        this.env = env;
    }

    startSession() {
        sendUdpReq( , this.env.port, this.env.host)
    }
}