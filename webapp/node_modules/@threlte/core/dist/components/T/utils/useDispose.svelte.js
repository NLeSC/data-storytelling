import { getContext, setContext } from 'svelte';
import { useDisposal } from '../../../context/fragments/disposal';
const contextName = Symbol('threlte-disposable-object-context');
/**
 * Checks if the given object is a disposable object. Scenes are not disposable.
 * @param object - The object to check.
 * @returns True if the object is a disposable object, false otherwise.
 */
export const isDisposableObject = (object) => {
    return typeof object?.dispose === 'function';
};
export const useSetDispose = (getDispose) => {
    const parentDispose = getContext(contextName);
    // We merge the local dispose with the parent dispose. If the parent dispose
    // is not set, we use true as default.
    const mergedDispose = $derived(getDispose() ?? parentDispose?.() ?? true);
    setContext(contextName, () => mergedDispose);
};
export const useDispose = (getDisposable) => {
    const disposable = $derived(getDisposable());
    const { disposableObjectMounted, disposableObjectUnmounted, removeObjectFromDisposal } = useDisposal();
    const parentDispose = getContext(contextName);
    // We merge the local dispose with the parent dispose. If the parent dispose
    // is not set, we use true as default.
    const dispose = $derived(parentDispose?.() ?? true);
    $effect(() => {
        if (dispose) {
            disposableObjectMounted(disposable);
            return () => disposableObjectUnmounted(disposable);
        }
        removeObjectFromDisposal(disposable);
        return;
    });
};
