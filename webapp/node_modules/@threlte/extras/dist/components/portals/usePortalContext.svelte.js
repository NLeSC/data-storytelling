import { useThrelteUserContext } from '@threlte/core';
import { SvelteMap } from 'svelte/reactivity';
const createPortalContext = () => {
    const portals = new SvelteMap();
    const ctx = {
        addPortal(object, id) {
            if (portals.has(id)) {
                console.warn(`Portal with id ${id} already exists. Skipping portal creation.`);
            }
            else {
                portals.set(id, object);
            }
        },
        removePortal(id) {
            if (!portals.has(id)) {
                console.warn(`Portal with id ${id} does not exist. Skipping portal removal.`);
            }
            else {
                portals.delete(id);
            }
        },
        getPortal(id) {
            return {
                get current() {
                    return portals.get(id);
                }
            };
        },
        hasPortal(id) {
            return portals.has(id);
        }
    };
    return ctx;
};
export const usePortalContext = () => {
    return useThrelteUserContext('threlte-portals', createPortalContext());
};
