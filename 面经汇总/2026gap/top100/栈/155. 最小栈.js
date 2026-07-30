var MinStack = function () {
    this.stack = [];
    this.minStack = [];
};

/**
 * @param {number} value
 * @return {void}
 */
MinStack.prototype.push = function (value) {
    this.stack.push(value);
    const minVal = this.minStack[this.minStack.length - 1];
    const min = typeof minVal === 'number' ? Math.min(minVal, value) : value;
    this.minStack.push(min);
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
    this.stack.pop();
    this.minStack.pop();
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
    return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function () {
    return this.minStack[this.minStack.length - 1];
};

const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);
minStack.getMin();
minStack.pop();
minStack.top();
minStack.getMin();
