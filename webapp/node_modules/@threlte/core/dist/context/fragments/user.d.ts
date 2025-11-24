import { type CurrentWritable } from '../../utilities';
export type ThrelteUserContext = CurrentWritable<Record<string | symbol, unknown>>;
export declare const createUserContext: () => ThrelteUserContext;
/**
 * ### `useUserContext`
 *
 * @returns The user context store. The context is to be used with
 * `useThrelteUserContext` to set and get the user context.
 */
export declare const useUserContext: () => ThrelteUserContext;
