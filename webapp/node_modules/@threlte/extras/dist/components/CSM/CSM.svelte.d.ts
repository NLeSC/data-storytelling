import type { Snippet } from 'svelte';
import type { Camera, ColorRepresentation, Vector3Tuple } from 'three';
import type { CSMParameters } from 'three/examples/jsm/csm/CSM.js';
import { CSM } from 'three/examples/jsm/csm/CSM.js';
interface Props {
    /**
     * Whether or not CSM is enabled. If `enabled={false}`, a slot named
     * `"disabled"` will be rendered.
     */
    enabled?: boolean;
    /**
     * The arguments to pass to the CSM constructor.
     */
    args?: Partial<CSMParameters>;
    /**
     * The camera to use for CSM. Defaults to the camera set by `makeDefault`.
     */
    camera?: Camera | undefined;
    /**
     * A configuration callback, which is triggered when CSM is activated. This
     * callback facilitates advanced configurations, such as enabling the fade
     * feature.
     */
    configure?: ((csm: CSM) => void) | undefined;
    lightIntensity?: number | undefined;
    lightColor?: ColorRepresentation | undefined;
    lightDirection?: Vector3Tuple;
    children?: Snippet;
    fallback?: Snippet;
}
declare const Csm: import("svelte").Component<Props, {}, "">;
type Csm = ReturnType<typeof Csm>;
export default Csm;
