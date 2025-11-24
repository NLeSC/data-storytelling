import type { Mesh } from 'three';
import type { Snippet } from 'svelte';
interface Props {
    meshes: Mesh[];
    index?: number;
    children?: Snippet;
}
declare const InnerInstancedMeshes: import("svelte").Component<Props, {}, "">;
type InnerInstancedMeshes = ReturnType<typeof InnerInstancedMeshes>;
export default InnerInstancedMeshes;
