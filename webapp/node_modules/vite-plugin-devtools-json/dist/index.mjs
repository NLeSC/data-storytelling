import fs from 'fs';
import path from 'path';
import { validate, v4 } from 'uuid';

const ENDPOINT = "/.well-known/appspecific/com.chrome.devtools.json";
const plugin = (options = {}) => ({
  name: "devtools-json",
  enforce: "post",
  configureServer(server) {
    const { config } = server;
    const { logger } = config;
    if (!config.env.DEV) {
      return;
    }
    const getOrCreateUUID = () => {
      if (options.uuid) {
        return options.uuid;
      }
      let { cacheDir } = config;
      if (!path.isAbsolute(cacheDir)) {
        let { root } = config;
        if (!path.isAbsolute(root)) {
          root = path.resolve(process.cwd(), root);
        }
        cacheDir = path.resolve(root, cacheDir);
      }
      const uuidPath = path.resolve(cacheDir, "uuid.json");
      if (fs.existsSync(uuidPath)) {
        const uuid2 = fs.readFileSync(uuidPath, { encoding: "utf-8" });
        if (validate(uuid2)) {
          return uuid2;
        }
      }
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      const uuid = v4();
      fs.writeFileSync(uuidPath, uuid, { encoding: "utf-8" });
      return uuid;
    };
    const normalizePaths = options.normalizeForWindowsContainer ?? (options.normalizeForChrome ?? true);
    if (Object.prototype.hasOwnProperty.call(options, "normalizeForChrome") && options.normalizeForWindowsContainer === void 0) {
      logger.warn(
        '[vite-plugin-devtools-json] "normalizeForChrome" is deprecated \u2013 please rename to "normalizeForWindowsContainer".'
      );
    }
    server.middlewares.use(ENDPOINT, async (_req, res) => {
      const resolveProjectRoot = () => {
        if (options.projectRoot) {
          return path.resolve(options.projectRoot);
        }
        let { root: root2 } = config;
        if (!path.isAbsolute(root2)) {
          root2 = path.resolve(process.cwd(), root2);
        }
        return root2;
      };
      const maybeNormalizePath = (absRoot) => {
        if (!normalizePaths) return absRoot;
        if (process.env.WSL_DISTRO_NAME) {
          const distro = process.env.WSL_DISTRO_NAME;
          const withoutLeadingSlash = absRoot.replace(/^\//, "");
          return path.join("\\\\wsl.localhost", distro, withoutLeadingSlash).replace(/\//g, "\\");
        }
        if (process.env.DOCKER_DESKTOP && !absRoot.startsWith("\\\\")) {
          const withoutLeadingSlash = absRoot.replace(/^\//, "");
          return path.join("\\\\wsl.localhost", "docker-desktop-data", withoutLeadingSlash).replace(/\//g, "\\");
        }
        return absRoot;
      };
      let root = maybeNormalizePath(resolveProjectRoot());
      const uuid = getOrCreateUUID();
      const devtoolsJson = {
        workspace: {
          root,
          uuid
        }
      };
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(devtoolsJson, null, 2));
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use(ENDPOINT, async (req, res) => {
      res.writeHead(404);
      res.end();
    });
  }
});

export { plugin as default };
