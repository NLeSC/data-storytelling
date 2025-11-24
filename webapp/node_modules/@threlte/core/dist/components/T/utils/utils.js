/**
 * Short cicruits if the input is not a function, then calls toString on Function with guaranteed safe behavior
 */
const isClass = (input) => {
    return typeof input === 'function' && Function.prototype.toString.call(input).startsWith('class ');
};
export const determineRef = (is, args) => {
    if (isClass(is)) {
        if (Array.isArray(args)) {
            return new is(...args);
        }
        else {
            return new is();
        }
    }
    return is;
};
