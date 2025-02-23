import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définition des applications disponibles
const apps = {
    home: {
        root: "src/apps/home",
        base: "/graduo/",
        outDir: "../../../dist/graduo",
    },
    natix: {
        root: "src/apps/natix",
        base: "/graduo/natix/",
        outDir: "../../../dist/graduo/natix",
    },
    decix: {
        root: "src/apps/decix",
        base: "/graduo/decix/",
        outDir: "../../../dist/graduo/decix",
    },
    metrix: {
        root: "src/apps/metrix",
        base: "/graduo/metrix/",
        outDir: "../../../dist/graduo/metrix",
    },
    chronix: {
        root: "src/apps/chronix",
        base: "/graduo/chronix/",
        outDir: "../../../dist/graduo/chronix",
    },
    degrix: {
        root: "src/apps/degrix",
        base: "/graduo/degrix/",
        outDir: "../../../dist/graduo/degrix",
    },
    monetix: {
        root: "src/apps/monetix",
        base: "/graduo/monetix/",
        outDir: "../../../dist/graduo/monetix",
    },
};

// Fonction pour créer la configuration d'une app
const createAppConfig = (appName) => {
    const app = apps[appName];
    if (!app) {
        throw new Error(`Application "${appName}" non trouvée`);
    }
    return defineConfig({
        plugins: [react()],
        root: app.root,
        base: app.base,
        server: {
            host: true,
            port: 5173,
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
                "@common": path.resolve(__dirname, "./src/common"),
                "@apps": path.resolve(__dirname, "./src/apps"),
            },
        },
        build: {
            outDir: app.outDir,
            emptyOutDir: true,
        },
    });
};

// Export par défaut qui retourne la configuration pour l'app "home"
export default createAppConfig("home");

// Export des configurations pour chaque app
export const natixConfig = () => createAppConfig("natix");
export const decixConfig = () => createAppConfig("decix");
export const metrixConfig = () => createAppConfig("metrix");
export const chronixConfig = () => createAppConfig("chronix");
export const degrixConfig = () => createAppConfig("degrix");
export const monetixConfig = () => createAppConfig("monetix");
