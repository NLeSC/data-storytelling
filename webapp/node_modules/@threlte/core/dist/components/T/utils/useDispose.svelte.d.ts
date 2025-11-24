import { type DisposableObject } from '../../../context/fragments/disposal';
/**
 * Checks if the given object is a disposable object. Scenes are not disposable.
 * @param object - The object to check.
 * @returns True if the object is a disposable object, false otherwise.
 */
export declare const isDisposableObject: (object: unknown) => object is DisposableObject;
export declare const useSetDispose: (getDispose: () => boolean | undefined) => void;
export declare const useDispose: (getDisposable: () => DisposableObject) => void;
