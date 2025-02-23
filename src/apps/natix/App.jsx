// src/App.jsx
import { useState } from "react";
import ControlPanel from "./components/ControlPanel";
import GraduatedLine from "@common/components/GraduatedLine";
import Navbar from "@common/components/Navbar";

/**
 * Composant principal de l'application GraduLine
 * Gère l'état global et la validation des paramètres de la ligne graduée
 * @returns {JSX.Element} Le composant App
 */
function App() {
    const [settings, setSettings] = useState({
        notation: "decimal",
        intervals: [0, 10],
        denominator: 4,
        step: 1,
    });

    /**
     * Gère les modifications des paramètres avec validation
     * @param {Object} newSettings - Nouveaux paramètres à valider
     * @param {string} newSettings.notation - Type de notation ("decimal", "fraction", "mixedNumber")
     * @param {number[]} newSettings.intervals - Bornes [min, max] de la ligne
     * @param {number} newSettings.denominator - Dénominateur pour les fractions
     * @param {number} newSettings.step - Pas entre les graduations principales
     */
    const handleSettingsChange = (newSettings) => {
        const validatedSettings = {
            ...newSettings,
            intervals: [
                Math.min(
                    newSettings.intervals[0],
                    newSettings.intervals[1] - 1
                ),
                Math.max(
                    newSettings.intervals[1],
                    newSettings.intervals[0] + 1
                ),
            ],
        };
        setSettings(validatedSettings);
    };

    return (
        <>
            <Navbar appName="Natix" />
            <div className="container mx-auto p-4 pt-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <ControlPanel
                            settings={settings}
                            onSettingsChange={handleSettingsChange}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <GraduatedLine settings={settings} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
