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
export declare const transitions: () => void;
