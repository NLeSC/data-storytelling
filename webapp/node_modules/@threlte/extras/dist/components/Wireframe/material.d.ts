import { type Uniform, type Material } from 'three';
export declare const WireframeMaterialShaders: {
    vertex: string;
    fragment: string;
};
export declare const setWireframeOverride: (material: Material, uniforms: {
    [key: string]: Uniform;
}) => void;
