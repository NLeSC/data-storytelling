import { CubeCamera, WebGLCubeRenderTarget } from 'three';
/**
 * creates a `CubeCamera` instance
 * `near` and `far`, and `resolution` are getters so you can use $state()
 * the camera's `renderTarget` is disposed when the component unmounts.
 */
export declare const useCubeCamera: (near?: () => number, far?: () => number, resolution?: () => number) => {
    camera: CubeCamera;
    renderTarget: WebGLCubeRenderTarget;
};
