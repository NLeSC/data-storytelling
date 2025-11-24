import { Mesh, Texture, type EulerTuple, type Vector3Tuple } from 'three';
import { type Props as ThrelteProps } from '@threlte/core';
import type { Snippet } from 'svelte';
interface Props extends ThrelteProps<Mesh> {
    src?: Texture | string;
    mesh?: Mesh;
    position?: Vector3Tuple;
    /** Euler for manual orientation or a single float for closest-vertex-normal orient */
    rotation?: EulerTuple | number;
    scale?: Vector3Tuple | number;
    polygonOffsetFactor?: number;
    depthTest?: boolean;
    debug?: boolean;
    ref?: Mesh;
    children?: Snippet<[{
        ref: Mesh;
    }]>;
}
declare const Decal: import("svelte").Component<Props, {}, "ref">;
type Decal = ReturnType<typeof Decal>;
export default Decal;
