// 1. new Set( arr )
const uniqueArray1 = array => {
    return [ ...new Set(array) ];
};

// 2. indexOf(value)
const uniqueArray2 = array => {
    let res = [];

    array.forEach(it => {
        if (res.indexOf(it) === -1) {
            res.push(it);
        }
    });

    return res;
};

// 3. indexOf
const uniqueArray3 = array => {
    return array.filter((value, index) => array.indexOf(value) === index);
};

// 4. Array.from
const uniqueArray4 = array => {
    return Array.from(new Set(array));
};