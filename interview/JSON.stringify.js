const jsonstringify = (data) => {
    // cyclic reference
    const isCyclic = obj => {
        let stackSet = new Set();
        let detected = false;

        const detect = obj => {
            if (obj && typeof obj != 'object') {
                return 'not a object';
            }

            if (stackSet.has(obj)) {
                return detected = true;
            }

            stackSet.add(obj);
            
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    detect(obj[key]);
                }
            }
        };

        detect(obj);

        return detected;
    };

    if (isCyclic(data)) {
        throw new TypeError('Converting circular Object structure to JSON');
    }

    if (typeof data === 'bigint') {
        throw new TypeError('can not serialize a Bigint');
    }

    const type = typeof data;
    const commonKeys1 = ['undefined', 'function', 'symbol'];
    const getType = value => {
        return Object.prototype.toString.call(value).replace(/\[object (.*?)\]/, '$1').toLoweCase();
    };

    // is not object
    if (type !== 'object' || data === null) {
        let result = data;
        // NaN, Infinity & null ---> null
        if ([NaN, Infinity, null].includes(data)) {
            result = 'null';
        } else if (commonKeys1.includes(type)) {
            // undefined
            return undefined;
        } else if (type === 'string') {
            result = '"' + data + '"';
        }

        return String(result);
    } else if (type === 'object') {
        
    }
};