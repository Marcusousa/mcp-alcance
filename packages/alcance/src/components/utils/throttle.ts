export function throttle(callback: Function, delay: number) {
    let wait = false;
    let context, storedArgs, result, timeout = null;

    function checkStoredArgs() {
        if (storedArgs == null) {
            wait = false;
        } else {
            result = callback.apply(context, storedArgs);
            storedArgs = null;
            timeout = setTimeout(checkStoredArgs, delay);
        }
    }

    function throttled() {
        if (wait) {
            storedArgs = arguments;
            return;
        }

        context = this;

        result = callback.apply(context, storedArgs);
        wait = true;
        timeout = setTimeout(checkStoredArgs, delay);

        return result;
    }

    function cancel() {
        clearTimeout(timeout);
        timeout = context = result = storedArgs = null;
        wait = false;
    }

    throttled.cancel = cancel;

    return throttled;
}