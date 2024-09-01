export class ProjectileBuffer<T> {
    /**
     * Last bufferLength number of elements
     */
    private buffer: T[] = [];
    /**
     * Value between 0 and bufferLength
     */
    private pointer = 0;
    /**
     * Max buffer length
     */
    private bufferLength: number;

    constructor(bufferLength = 10) {
        this.bufferLength = bufferLength;
    }

    push(element: T) {
        if (this.buffer.length === this.bufferLength) {
            this.buffer[this.pointer] = element;
        } else {
            this.buffer.push(element);
        }
        this.pointer = (this.pointer + 1) % this.bufferLength;
    }

    get(i: number) {
        return this.buffer[i];
    }

    forEach(callback: (item: T, index: number) => void) {
        return this.buffer.forEach(callback);
    }
    get length() {
        return this.buffer.length;
    }

    // Gets the i-th element before last one
    getLast(i: number) {
        return this.buffer[this.pointer + this.bufferLength - 1 - i];
    }
}
