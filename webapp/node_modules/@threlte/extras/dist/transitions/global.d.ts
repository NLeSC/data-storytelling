import type { ThrelteTransition } from './types';
/**
 * # EXPERIMENTAL
 *
 * **This plugin is experimental and may change or be removed.**
 *
 * Marks a transition as global.
 *
 * @example
 *
 * ```svelte
 * <script>
 *   import { global } from '@threlte/extras'
 *   import { fade } from './transitions'
 * </script>
 *
 * <T.Mesh transition={global(fade)} />
 * ```
 */
export declare const global: (transition: ThrelteTransition<unknown>) => ThrelteTransition<unknown> & {
    global: boolean;
};
