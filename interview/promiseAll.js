// promise.all([ array ])  return an array of res

Promise.myFirstPromiseAll = promises => {
    return new Promise((resolve, reject) => {
        let count = 0;
        let result = [];
        const pLen = promises.length;
        
        if (pLen === 0) {
            return resolve([]);
        }

        promises.forEach((promise, index) => {
            Promise.resolve(promise)
                .then(res => {
                    count += 1;
                    result[ index ] = res;

                    if (count === pLen) {
                        resolve(result);
                    }
                })
                .catch(reject);
        });
    });
};

Promise.mySecondPromiseAll = promises => {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject('Promise.all should accept an array');
        }

        const pLength = promises.length;
        let remaining = pLength;
        const result = [];

        if (pLength === 0) {
            return resolve([]);
        }

        const response = (index, value) => {
            try {
                // call response repeatedly (promise type)
                if (value instanceof Promise) {
                    value.then(valPromise => {
                        response(index, valPromise);
                    }, reject);
                    return;
                }
                // produced value pushed to result list
                result[ index ] = value;
                
                if (--remaining === 0) {
                    resolve(result);
                }
            } catch(err) {
                reject(err);
            }
        };

        for (let index = 0, value; value = promises[index++]; ) {
            response(index, value);
        }
    });
};

let p1 = Promise.resolve(1);
let p2 = 2;
let p3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 3);
});
let p4 = Promise.reject('出错啦')

Promise.mySecondPromiseAll([ p1, p2, p4 ]).then((res) => {
    console.log(res, 'res--3')
  }).catch((err) => {
    console.log('err', err)
  })