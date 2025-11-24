/**
 * Typeguard to check if a value is extending THREE.EventDispatcher
 * @param value
 * @returns
 */
const isEventDispatcher = (value) => {
    return (value !== null &&
        typeof value === 'object' &&
        'addEventListener' in value &&
        'removeEventListener' in value);
};
export const useEvents = (getRef, propKeys, props) => {
    const ref = $derived(getRef());
    for (const key of propKeys) {
        const prop = $derived(props[key]);
        // Don't create the effect unless the prop begins with "on"
        if (key.startsWith('on')) {
            $effect.pre(() => {
                if (typeof prop !== 'function' || !isEventDispatcher(ref)) {
                    return;
                }
                const name = key.slice(2);
                ref.addEventListener(name, prop);
                return () => ref.removeEventListener(name, prop);
            });
        }
    }
};
