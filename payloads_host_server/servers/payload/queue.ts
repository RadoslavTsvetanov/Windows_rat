export class Queue<T>{
    private items: T[] = [];

    get(): T {
        if (this.items.length === 0) {
            throw new Error("Queue is empty");
        }
        return this.items.pop()!;
    }

    add(item: T): void {
        this.items.unshift(item);
    }
}
