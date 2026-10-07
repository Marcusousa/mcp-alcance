export const toInteger = (value: string, defaultValue = NaN) => {
    const integer = parseInt(value, 10);
    return isNaN(integer) ? defaultValue : integer;
}