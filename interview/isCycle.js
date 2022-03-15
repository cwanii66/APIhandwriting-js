const isCycle = obj => {
    let stackSet = new Set();
    let detected = false;

    const detect = obj => {
        if (obj && typeof obj != 'object') {
            return;
        }

        if (stackSet.has(obj)) {
            return detected = true;
        }

        stackSet.add(obj);

        for (let key in obj) {
            if (obj.hasOwnproperty(key)) {
                detect(obj[key]);
            }
        }

        stackSet.delete(obj);
    };
    detect(obj);

    return detected;
};