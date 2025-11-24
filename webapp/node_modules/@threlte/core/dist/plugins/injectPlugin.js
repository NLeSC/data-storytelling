import { getContext, setContext } from 'svelte';
import { pluginContextKey } from './types';
export function injectPlugin(name, plugin) {
    if (!plugin)
        return;
    setContext(pluginContextKey, {
        ...getContext(pluginContextKey),
        [name]: plugin
    });
}
