import { createCacheContext } from './fragments/cache';
import { createCameraContext } from './fragments/camera';
import { createDisposalContext } from './fragments/disposal';
import { createDOMContext } from './fragments/dom';
import { createParentContext } from './fragments/parent';
import { createRootParentObject3DContext } from './fragments/parentObject3D';
import { createRendererContext } from './fragments/renderer.svelte';
import { createSceneContext } from './fragments/scene';
import { createSchedulerContext } from './fragments/scheduler.svelte';
import { createUserContext } from './fragments/user';
export const createThrelteContext = (options) => {
    const { scene } = createSceneContext();
    return {
        scene,
        ...createDOMContext(options),
        ...createCacheContext(),
        ...createParentContext(scene),
        ...createRootParentObject3DContext(scene),
        ...createDisposalContext(),
        ...createSchedulerContext(options),
        ...createCameraContext(),
        ...createRendererContext(options),
        ...createUserContext()
    };
};
