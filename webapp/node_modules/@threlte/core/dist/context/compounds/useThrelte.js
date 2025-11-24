import { Scene } from 'three';
import { useCamera } from '../fragments/camera';
import { useDOM } from '../fragments/dom';
import { useRenderer } from '../fragments/renderer.svelte';
import { useScene } from '../fragments/scene';
import { useScheduler } from '../fragments/scheduler.svelte';
/**
 * ### `useThrelte`
 *
 * This hook provides access to the main context of a Threlte application.
 *
 * ```svelte
 * <script>
 *   import { useThrelte } from 'threlte'
 *   const { camera } = useThrelte()
 *
 *   // Access the camera
 *   console.log(camera.current) // => PerspectiveCamera { … }
 * </script>
 * ```
 */
export const useThrelte = () => {
    const schedulerCtx = useScheduler();
    const rendererCtx = useRenderer();
    const cameraCtx = useCamera();
    const sceneCtx = useScene();
    const domCtx = useDOM();
    const context = {
        advance: schedulerCtx.advance,
        autoRender: schedulerCtx.autoRender,
        autoRenderTask: rendererCtx.autoRenderTask,
        camera: cameraCtx.camera,
        colorManagementEnabled: rendererCtx.colorManagementEnabled,
        colorSpace: rendererCtx.colorSpace,
        dpr: rendererCtx.dpr,
        invalidate: schedulerCtx.invalidate,
        mainStage: schedulerCtx.mainStage,
        renderer: rendererCtx.renderer,
        renderMode: schedulerCtx.renderMode,
        renderStage: schedulerCtx.renderStage,
        scheduler: schedulerCtx.scheduler,
        shadows: rendererCtx.shadows,
        shouldRender: schedulerCtx.shouldRender,
        dom: domCtx.dom,
        canvas: domCtx.canvas,
        size: domCtx.size,
        toneMapping: rendererCtx.toneMapping,
        get scene() {
            return sceneCtx.scene;
        },
        set scene(scene) {
            sceneCtx.scene = scene;
        }
    };
    return context;
};
