/**
 * @param {*} array deeply nested data
 * @returns array new array
 */
const flat1 = array => {
    return array.reduce((accumulator, currentValue) => {
        return accumulator.concat(Array.isArray(currentValue) ? flat1(currentValue) : currentValue);
    }, []);
};

// js flat()
/**
 * @param {*} array deeply nested array
 * @returns array
 */
const flat2 = array => array.flat(Infinity);


const flat3 = array => {
    const result = [];
    const stack = [ ...array ];

    while(stack.length !== 0) {
        const value = stack.pop();
        if (Array.isArray(value)) {
            stack.push(...value);
        } else {
            result.unshift(value);
        }
    }

    return result;
};
