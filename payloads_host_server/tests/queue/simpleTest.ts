import { Queue } from "../../servers/payload/queue";

const lastElement = "you should see this last";
const secondElement = "hi again";
const firstElement = "hi";
const queue = new Queue<string>();
queue.add(firstElement);
queue.add(secondElement);
queue.add(lastElement);

console.log(queue.get() === firstElement);
console.log(queue.get() === secondElement);
console.log(queue.get() === lastElement);
