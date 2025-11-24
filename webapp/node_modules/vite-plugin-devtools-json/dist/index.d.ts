import { Plugin } from 'vite';

interface DevToolsJsonOptions {
    /**
     * Optional fixed UUID. If omitted the plugin will generate
     * (and cache) one automatically, which is the previous default behaviour.
     */
    uuid?: string;
    /**
     * Absolute (or relative) path that should be reported as the project root
     * in DevTools. When omitted, we fall back to Vite’s `config.root` logic.
     */
    projectRoot?: string;
    /**
     * @deprecated Use `normalizeForWindowsContainer` instead. Will be removed in a future major version.
     */
    normalizeForChrome?: boolean;
    /**
     * Whether to rewrite Linux paths to UNC form so Chrome running on Windows
     * (WSL or Docker Desktop) can mount them as a workspace. Enabled by default.
     */
    normalizeForWindowsContainer?: boolean;
}
declare const plugin: (options?: DevToolsJsonOptions) => Plugin;

export { plugin as default };
