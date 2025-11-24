/**
 * Only scalar values are memoized, objects and arrays are considered
 * non-equa by default, to ensure reactivity works as you would
 * expect in svelte.
 * @param value
 * @returns
 */
export declare const memoizeProp: (value: unknown) => boolean;
export declare const useProps: () => {
    updateProp: <T>(instance: T, key: string, value: any, pluginsProps?: string[], manualCamera?: boolean) => void;
};
