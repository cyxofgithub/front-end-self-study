function debouce(fn, time) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, time);
    };
}
const test = (a) => {
    console.log(a);
};

const testFn = debouce(test, 1000);

// testFn(1);
// testFn(2);

function throttle(fn, time) {
    let last = 0;
    return function (...args) {
        const now = Date.now();

        if (now - last > time) {
            fn.apply(this, args);
            last = now;
        }
    };
}
const throttleFn = throttle(test, 1000);

throttleFn(3);
throttleFn(4);

setTimeout(() => {
    throttleFn(5);
}, 2000);
