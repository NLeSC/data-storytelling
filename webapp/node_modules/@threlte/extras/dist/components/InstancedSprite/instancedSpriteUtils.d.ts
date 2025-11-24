import type { InstancedSpriteUserCtx } from './types';
export declare const useInstancedSprite: <T>() => InstancedSpriteUserCtx<T>;
export type SpritesheetMetadata = {
    url: string;
    type: 'rowColumn' | 'frameSize';
    width: number;
    height: number;
    animations: {
        name: string;
        frameRange: [number, number];
    }[];
}[];
type SpriteMetaConfig = readonly Pick<SpritesheetMetadata[number], 'animations'>[];
export type UseSpriteMetaConfig<T extends SpriteMetaConfig> = T[number]['animations'][number]['name'];
export declare const buildSpritesheet: {
    from: <T extends SpritesheetMetadata>(meta: Readonly<SpritesheetMetadata>) => {
        useInstancedSprite: () => InstancedSpriteUserCtx<UseSpriteMetaConfig<T>>;
        spritesheet: ReturnType<(options?: {
            makeSlimGeometry?: boolean;
            slimOptions?: {
                vertices: number;
                alphaThreshold: number;
            };
        }) => Promise<{
            spritesheet: import("@threejs-kit/instanced-sprite-mesh").SpritesheetFormat;
            texture: import("three").Texture;
            geometry?: import("@threejs-kit/instanced-sprite-mesh/dist/dietSprite").ClippedSpriteGeometry;
        }>>;
    };
    fromAseprite: (asepriteDataUrl: string, spriteImageUrl: string) => Promise<{
        spritesheet: {
            frames: [x: number, y: number, w: number, h: number][];
            animations: Record<string, [frameId: number, duration: number][]>;
            sheetSize: [w: number, h: number];
            animationLengths: number[];
        };
        texture: import("three").Texture;
    }>;
};
export {};
