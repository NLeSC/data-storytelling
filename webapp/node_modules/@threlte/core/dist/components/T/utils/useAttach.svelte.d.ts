import type { BaseProps, MaybeInstance } from '../types';
export declare const useAttach: <T extends unknown>(getRef: () => T, getAttach: () => BaseProps<T>["attach"]) => void;
