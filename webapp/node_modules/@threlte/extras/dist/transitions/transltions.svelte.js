import { injectPlugin, useThrelte } from '@threlte/core';
import { transition } from './internals';
const el = typeof window !== 'undefined' ? document.createElement('div') : undefined;
/**
 * # EXPERIMENTAL
 *
 * **This plugin is experimental and may change or be removed.**
 *
 * ---
 *
 * The plugin `transitions` allows you to use transitions with Threlte.
 * The syntax is slightly different from Svelte's transitions, but it's very similar.
 *
 * ## Usage
 *
 * ```svelte
 * <script>
 *   import { transitions, createTransition } from '@threlte/extras'
 *
 *   transitions()
 *
 *   let { show } = $props()
 *
 *   const fade = createTransition((ref) => {
 *     if (!isInstanceOf(ref, 'Material')) return
 *     if (!ref.transparent) {
 *       ref.transparent = true
 *       ref.needsUpdate = true
 *     }
 *     return {
 *       tick(t) {
 *         ref.opacity = t
 *       },
 *       easing: cubicOut,
 *       duration: 400
 *     }
 *   })
 * </script>
 *
 * {#if showCube}
 *   <T.Mesh>
 *     <T.BoxGeometry />
 *     <T.MeshStandardMaterial transition={fade} />
 *   </T.Mesh>
 * {/if}
 * ```
 */
export const transitions = () => {
    injectPlugin('transitions', (args) => {
        // Early return in non-browser environments
        if (!el)
            return;
        // No transitions provided, nothing to do
        if (!args.props.in && !args.props.out && !args.props.transition)
            return;
        const { invalidate } = useThrelte();
        // Reroute events to the props
        el.dispatchEvent = (e) => {
            if (e.type === 'introstart') {
                args.props.onintrostart?.();
            }
            else if (e.type === 'outrostart') {
                args.props.onoutrostart?.();
            }
            else if (e.type === 'introend') {
                args.props.onintroend?.();
            }
            else if (e.type === 'outroend') {
                args.props.onoutroend?.();
            }
            return true;
        };
        const convertTransition = (transitionC
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) => {
            return (_node, _params, options) => {
                const t = transitionC(args.ref, {
                    direction: options.direction
                });
                return {
                    ...t,
                    tick(...args) {
                        invalidate();
                        t?.tick?.(...args);
                    }
                };
            };
        };
        const props = ['in', 'out', 'transition'];
        const globalFlags = {
            in: 5,
            out: 6,
            transition: 7
        };
        const localFlags = {
            in: 1,
            out: 2,
            transition: 3
        };
        for (const prop of props) {
            const t = args.props[prop];
            if (t) {
                const global = 'global' in t;
                const flag = global ? globalFlags[prop] : localFlags[prop];
                transition(flag, el, () => convertTransition(t));
            }
        }
        return {
            pluginProps: [
                'in',
                'out',
                'transition',
                'onintrostart',
                'onoutrostart',
                'onintroend',
                'onoutroend'
            ]
        };
    });
};
