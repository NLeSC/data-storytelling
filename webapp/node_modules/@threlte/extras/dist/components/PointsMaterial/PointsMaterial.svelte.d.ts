import { PointsMaterial as ThreePointsMaterial, type WebGLProgramParametersWithUniforms, type WebGLRenderer } from 'three';
declare class PointsMaterial extends ThreePointsMaterial {
    alphaToCoverage: boolean;
    onBeforeCompile(parameters: WebGLProgramParametersWithUniforms, _renderer: WebGLRenderer): void;
}
export default PointsMaterial;
