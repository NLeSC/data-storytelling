import { getContext, setContext } from 'svelte';
import { currentWritable } from '../../utilities';
export const createUserContext = () => {
    const userCtx = currentWritable({});
    setContext('threlte-user-context', userCtx);
    return userCtx;
};
/**
 * ### `useUserContext`
 *
 * @returns The user context store. The context is to be used with
 * `useThrelteUserContext` to set and get the user context.
 */
export const useUserContext = () => {
    const context = getContext('threlte-user-context');
    if (!context) {
        throw new Error('useUserContext can only be used in a child component to <Canvas>.');
    }
    return context;
};
