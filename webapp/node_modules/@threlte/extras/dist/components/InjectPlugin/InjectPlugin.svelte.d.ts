import { type Plugin } from '@threlte/core';
import type { Snippet } from 'svelte';
type $$ComponentProps = {
    name: string;
    plugin: Plugin;
    children?: Snippet;
};
/**
 * This component is used to inject plugins. You provide an injector
 * function that injects a plugin.
 *
 * @example
 * ```svelte
 * <InjectPlugin>
 * {@render children?.()}
 * </InjectPlugin>
 * ```
 */
declare const InjectPlugin: import("svelte").Component<$$ComponentProps, {}, "">;
type InjectPlugin = ReturnType<typeof InjectPlugin>;
export default InjectPlugin;
