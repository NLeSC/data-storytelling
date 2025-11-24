import type { OrthographicCamera, PerspectiveCamera } from 'three';
export declare const useCamera: (getCamera: () => PerspectiveCamera | OrthographicCamera, getManual: () => boolean, getMakeDefault: () => boolean) => void;
