import { getContext, onMount, setContext } from 'svelte';
import { currentWritable, toCurrentReadable } from '../../utilities';
export const createDOMContext = (options) => {
    const { dom, canvas } = options;
    const size = currentWritable({ width: dom.offsetWidth, height: dom.offsetHeight });
    onMount(() => {
        const resizeObserver = new ResizeObserver(() => {
            const { offsetWidth, offsetHeight } = dom;
            if (size.current.width !== offsetWidth || size.current.height !== offsetHeight) {
                size.set({ width: offsetWidth, height: offsetHeight });
            }
        });
        resizeObserver.observe(dom);
        return () => {
            resizeObserver.disconnect();
        };
    });
    const context = {
        dom,
        canvas,
        size: toCurrentReadable(size)
    };
    setContext('threlte-dom-context', context);
    return context;
};
export const useDOM = () => {
    const context = getContext('threlte-dom-context');
    if (!context) {
        throw new Error('useDOM can only be used in a child component to <Canvas>.');
    }
    return context;
};
