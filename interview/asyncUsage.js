// 1. sleep()
async function sleep(delay) {
    return new Promise( resolve => setTimeout(resolve, delay) );
}

async function foo() {
    const t0 = Date.now();
    await sleep(1500);
    console.log(Date.now() - t0);
}
foo();

// 2. 利用平行执行
// 错过平行加速的机会
// version 1.0
async function randomDelay(id) {
    // delay 0 ~ 1000 ms
    const delay = Math.random() * 1000;
    return new Promise(resolve => setTimeout(() => {
        console.log(`${id} finished`);
        resolve();
    }, delay));
}
async function bar() {
    const t0 = Date.now();
    for(let i = 0; i < 5; i++) {
        await randomDelay(i); // time wasted
    }
    console.log(`${Date.now() - t0}ms elapsed`)
}
bar();

// if order is unnecessary, please initialize all of the promise once and wait for result then

async function randomDelay2(id) {
    const delay = Math.random() * 1000;
    return new Promise(resolve => setTimeout(() => {
        setTimeout(console.log, 0, `${id} finished`);
        resolve(id);
    }, delay));
}

async function baz() {
    const t0 = Date.now();

    // const p0 = randomDelay(0);
    // const p1 = randomDelay(1);
    // const p2 = randomDelay(2);
    // const p3 = randomDelay(3);
    // const p4 = randomDelay(4);

    // await p0;
    // await p1;
    // await p2;
    // await p3;
    // await p4; 
    const promises = Array(5)
        .fill(null)
        .map((_, i) => randomDelay2(i));

        for (const p of promises) {
            // await p;
            console.log(`awaited ${await p}`);
        }

    // setTimeout(console.log, 0, `${Date.now() - t0}ms elapsed`);
    console.log(`${Date.now() - t0}ms elapsed`); 
}
baz();

// 3. 串行执行
async function addTwo(x) {return x + 2;}
async function addThree(x) {return x + 3;}
async function addFive(x) {return x + 5;}

async function addTen(x) {
    for (const fn of [addTwo, addThree, addFive]) {
        x = await fn(x);
    }
    return x;
}

addTen(9).then(console.log);


// 4. 栈追踪与内存管理
function fooPromiseExecutor(resolve, reject) {
    setTimeout(reject, 1000, 'bar');
}

function foo() {
    new Promise(fooPromiseExecutor);
}
foo();

async function foo2() {
    await new Promise(fooPromiseExecutor);
}
foo2();