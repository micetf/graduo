import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALID_MODULES = ["decix", "metrix", "chronix", "degrix", "monetix"];

const deleteModule = async (moduleName) => {
    // Vérification du nom du module
    if (!VALID_MODULES.includes(moduleName)) {
        console.error(`❌ Erreur: "${moduleName}" n'est pas un module valide.`);
        console.log("Modules valides:", VALID_MODULES.join(", "));
        return;
    }

    // Protection contre la suppression du module natix
    if (moduleName === "natix") {
        console.error("❌ Erreur: Impossible de supprimer le module natix.");
        return;
    }

    const moduleDir = path.join(__dirname, "..", "src", "apps", moduleName);
    const distDir = path.join(__dirname, "..", "dist", "graduo", moduleName);

    try {
        // Vérification de l'existence du module
        try {
            await fs.access(moduleDir);
        } catch {
            console.error(
                `❌ Le module "${moduleName}" n'existe pas dans src/apps/`
            );
            return;
        }

        // Suppression du répertoire du module
        await fs.rm(moduleDir, { recursive: true });
        console.log(`✅ Module supprimé: ${moduleDir}`);

        // Suppression du répertoire de build si existant
        try {
            await fs.access(distDir);
            await fs.rm(distDir, { recursive: true });
            console.log(`✅ Build supprimé: ${distDir}`);
        } catch {
            // Le dossier dist n'existe pas, on ignore
        }

        // Suppression du fichier de configuration Vite si existant
        const configFile = path.join(
            __dirname,
            "..",
            `vite.${moduleName}.config.js`
        );
        try {
            await fs.access(configFile);
            await fs.unlink(configFile);
            console.log(`✅ Configuration supprimée: ${configFile}`);
        } catch {
            // Le fichier de config n'existe pas, on ignore
        }

        console.log(`\n🗑️  Module "${moduleName}" supprimé avec succès !`);
    } catch (error) {
        console.error(
            `❌ Erreur lors de la suppression du module "${moduleName}":`,
            error
        );
    }
};

// Gestion des arguments
const moduleArg = process.argv[2];
if (!moduleArg) {
    console.error(
        "❌ Erreur: Veuillez spécifier le nom du module à supprimer."
    );
    console.log("Exemple: node delete-module.cjs decix");
    console.log("Modules disponibles:", VALID_MODULES.join(", "));
} else {
    deleteModule(moduleArg);
}
