declare const Scene: import("svelte").Component<{
    plugin?: {
        fn: (args: any) => void;
        props?: string[];
    };
    attached?: boolean;
    dispose?: boolean;
}, {}, "">;
export default Scene;
