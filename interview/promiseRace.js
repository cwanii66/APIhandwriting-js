Promise.myPromiseRace = promises => {
    return new Promise((resolve, reject) => {
        promises.forEach(p => {
            Promise.resolve(p).then(resolve).catch(reject);
        });
    });
};

const promise1 = new Promise((rs, rj) => {
    setTimeout(rs, 500, 1);
});
const promise2 = new Promise((rs, rj) => {
    setTimeout(rs, 100, 2);
});

Promise.myPromiseRace([promise1, promise2]).then(value => {
    console.log(value); // 2
});
Promise.myPromiseRace([promise1, promise2, 3]).then(value => {
    console.log(value); // 3
});