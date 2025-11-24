import type { Object3D } from 'three';
type PortalContext = {
    addPortal: (object: Object3D, id: string) => void;
    removePortal: (id: string) => void;
    hasPortal: (id: string) => boolean;
    getPortal: (id: string) => {
        current: Object3D | undefined;
    };
};
export declare const usePortalContext: () => PortalContext;
export {};
