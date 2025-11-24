import type { RenderTargetOptions } from 'three';
import { DepthTexture, WebGLRenderTarget } from 'three';
export type UseFBOOptions = RenderTargetOptions & {
    /**
     * if set, the scene depth will be rendered into buffer.depthTexture
     */
    depth?: {
        width?: number;
        height?: number;
    } | DepthTexture | boolean;
    /**
     * if set, the render target size will be set to the corresponding width and height and not use or follow the size of the canvas
     */
    size?: {
        width?: number;
        height?: number;
    };
};
export declare const useFBO: ({ depth, size, ...targetOptions }?: UseFBOOptions) => WebGLRenderTarget;
