import type { Snippet } from 'svelte';
import type { InstancedMesh } from 'three';
interface Props {
    instancedMesh: InstancedMesh;
    id: string;
    limit: number;
    range: number;
    update: boolean;
    children?: Snippet;
}
declare const Api: import("svelte").Component<Props, {}, "">;
type Api = ReturnType<typeof Api>;
export default Api;
