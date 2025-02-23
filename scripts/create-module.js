import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES = {
    decix: {
        title: "Decix - Nombres décimaux",
        description:
            "Explorez les nombres décimaux et leurs fractions sur une ligne graduée interactive.",
        name: "Decix",
    },
    metrix: {
        title: "Metrix - Mesures de longueur",
        description:
            "Découvrez les mesures de longueur et leurs fractions sur une ligne graduée interactive.",
        name: "Metrix",
    },
    chronix: {
        title: "Chronix - Mesures de temps",
        description:
            "Visualisez les durées et leurs fractions sur une ligne graduée interactive.",
        name: "Chronix",
    },
    degrix: {
        title: "Degrix - Mesures d'angles",
        description:
            "Représentez les angles et leurs fractions sur une ligne graduée interactive.",
        name: "Degrix",
    },
    monetix: {
        title: "Monetix - Manipulation de monnaie",
        description:
            "Manipulez la monnaie et ses fractions sur une ligne graduée interactive.",
        name: "Monetix",
    },
};

const createModule = async (moduleName) => {
    const module = MODULES[moduleName];
    if (!module) {
        console.error(
            `Module "${moduleName}" non trouvé dans la configuration.`
        );
        return;
    }

    const moduleDir = path.join(__dirname, "..", "src", "apps", moduleName);

    // Création du répertoire du module
    await fs.mkdir(moduleDir, { recursive: true });

    // Création de index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${module.title} | Graduo</title>
        <meta 
            name="description" 
            content="${module.description}"
        />
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="./main.jsx"></script>
    </body>
</html>`;

    // Création de main.jsx
    const mainJsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

    // Création de App.jsx
    const appJsx = `import React from 'react';
import Navbar from '@common/components/Navbar';

/**
 * Composant principal de l'application ${module.name}
 * @returns {JSX.Element} Le composant App
 */
function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar appName="${module.name}" />
            
            <main className="container mx-auto px-4 pt-20">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-4">${module.title}</h1>
                    <p className="text-gray-600">${module.description}</p>
                    <p className="mt-4 text-sm text-gray-500">Module en cours de développement</p>
                </div>
            </main>
        </div>
    );
}

export default App;`;

    // Création de index.css
    const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
    html {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                     "Helvetica Neue", Arial, "Noto Sans", sans-serif, 
                     "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
}`;

    // Écriture des fichiers
    await Promise.all([
        fs.writeFile(path.join(moduleDir, "index.html"), indexHtml),
        fs.writeFile(path.join(moduleDir, "main.jsx"), mainJsx),
        fs.writeFile(path.join(moduleDir, "App.jsx"), appJsx),
        fs.writeFile(path.join(moduleDir, "index.css"), indexCss),
    ]);

    console.log(`✅ Module ${moduleName} créé avec succès !`);
};

// Création de tous les modules
const createAllModules = async () => {
    for (const moduleName of Object.keys(MODULES)) {
        await createModule(moduleName);
    }
    console.log("🎉 Tous les modules ont été créés !");
};

// Si le script est exécuté directement
const moduleArg = process.argv[2];
if (moduleArg) {
    createModule(moduleArg);
} else {
    createAllModules();
}
