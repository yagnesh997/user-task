// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pick = (object: any, keys: string[]): object => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return keys.reduce((obj: any, key: string) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
            // eslint-disable-next-line no-param-reassign
            obj[key] = object[key];
        }
        return obj;
    }, {});
};

export default pick;
