import { type Props as ThrelteProps } from '@threlte/core';
import { type Group, type Mesh, type MeshBasicMaterial } from 'three';
interface Props extends ThrelteProps<typeof Group> {
    /** Can be a URL or SVG data */
    src: string;
    skipFill?: boolean;
    skipStrokes?: boolean;
    fillMaterialProps?: ThrelteProps<typeof MeshBasicMaterial>;
    strokeMaterialProps?: ThrelteProps<typeof MeshBasicMaterial>;
    fillMeshProps?: ThrelteProps<typeof Mesh>;
    strokeMeshProps?: ThrelteProps<typeof Mesh>;
}
declare const Svg: import("svelte").Component<Props, {}, "ref">;
type Svg = ReturnType<typeof Svg>;
export default Svg;
