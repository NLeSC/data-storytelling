import { observe, useThrelte } from '@threlte/core';
export const useEnvironment = (options) => {
    const { invalidate } = useThrelte();
    // save lastScene and restore when scene changes and on unmount
    observe(() => [options.scene], ([scene]) => {
        const { background, environment } = scene;
        return () => {
            scene.background = background;
            scene.environment = environment;
        };
    });
    let background = $state();
    let environment = $state();
    observe(() => [options.scene], ([scene]) => {
        background = scene.background;
        environment = scene.environment;
    });
    $effect(() => {
        if (options.texture === undefined || !options.isBackground) {
            return;
        }
        options.scene.background = options.texture;
        invalidate();
        return () => {
            // background is allowed to be `null`
            if (background !== undefined) {
                options.scene.background = background;
                invalidate();
            }
        };
    });
    $effect(() => {
        if (options.texture === undefined) {
            return;
        }
        options.scene.environment = options.texture;
        invalidate();
        return () => {
            // environment is allowed to be `null`
            if (environment !== undefined) {
                options.scene.environment = environment;
                invalidate();
            }
        };
    });
};
