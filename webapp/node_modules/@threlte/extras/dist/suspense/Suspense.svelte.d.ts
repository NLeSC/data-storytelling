import type { Snippet } from 'svelte';
interface Props {
    final?: boolean;
    children?: Snippet<[{
        suspended: boolean;
        errors: Error[];
    }]>;
    error?: Snippet<[{
        errors: Error[];
    }]>;
    fallback?: Snippet;
    onload?: () => void;
    onerror?: (error: Error[]) => void;
    onsuspend?: () => void;
}
declare const Suspense: import("svelte").Component<Props, {}, "">;
type Suspense = ReturnType<typeof Suspense>;
export default Suspense;
