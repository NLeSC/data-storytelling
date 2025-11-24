import { type CurrentReadable } from '../../utilities';
type DOMContext = {
    /** The canvas wrapper element */
    dom: HTMLElement;
    canvas: HTMLCanvasElement;
    size: CurrentReadable<{
        width: number;
        height: number;
    }>;
};
export type CreateDOMContextOptions = {
    dom: HTMLElement;
    canvas: HTMLCanvasElement;
};
export declare const createDOMContext: (options: CreateDOMContextOptions) => DOMContext;
export declare const useDOM: () => DOMContext;
export {};
