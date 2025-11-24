import { getContext } from 'svelte';
import { pluginContextKey } from '../../../plugins/types';
export const usePlugins = (args) => {
    const plugins = getContext(pluginContextKey);
    if (!plugins)
        return;
    const pluginsProps = [];
    const pluginsArray = Object.values(plugins);
    if (pluginsArray.length > 0) {
        const pluginArgs = args();
        // initalize plugins
        for (let i = 0; i < pluginsArray.length; i++) {
            const plugin = pluginsArray[i];
            // initialize plugin
            const p = plugin(pluginArgs);
            if (p && p.pluginProps) {
                pluginsProps.push(...p.pluginProps);
            }
        }
    }
    return {
        pluginsProps
    };
};
