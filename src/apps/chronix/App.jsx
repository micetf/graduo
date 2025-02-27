import { useState, useMemo } from "react";
import Navbar from "@common/components/Navbar";
import { useGraduationInteractionsTime } from "./hooks/useGraduationInteractionsTime";
import TimeControlPanel from "./components/TimeControlPanel";
import TimeDisplay from "./components/TimeDisplay";
import TimeDurationCalculator from "./components/TimeDurationCalculator";
import TimeOperations from "./components/TimeOperations";
import TimeGraduatedLine from "./components/TimeGraduatedLine";
import "./index.css";

// Configuration par défaut pour la ligne graduée temporelle
const DEFAULT_SETTINGS = {
    notation: "time", // Notation spécifique au temps
    intervals: [0, 60], // Par défaut, une heure (en minutes)
    denominator: 60, // Pour les subdivisions (secondes dans une minute)
    step: 5, // Pas de 5 minutes
    timeUnit: "minute", // Unité de temps par défaut
    displayFormat: "mixed", // Format d'affichage (mixed, decimal, digital)
};

/**
 * Composant principal du module Chronix
 * @returns {JSX.Element} Le composant App de Chronix
 */
function App() {
    // État pour les paramètres de la ligne graduée
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [values, setValues] = useState(new Set());
    const [hiddenMainValues, setHiddenMainValues] = useState(new Set());
    const [arrows, setArrows] = useState(new Set());

    // Hooks personnalisés pour la gestion des interactions
    const { hideAllMainValues, showAllMainValues, resetDisplay } =
        useGraduationInteractionsTime(settings, null, {
            values,
            hiddenMainValues,
            arrows,
            setValues,
            setHiddenMainValues,
            setArrows,
        });

    // Vérifie si toutes les graduations principales sont masquées
    const areAllMainValuesHidden = useMemo(() => {
        const mainValuesCount =
            Math.floor(
                (settings.intervals[1] - settings.intervals[0]) / settings.step
            ) + 1;
        return hiddenMainValues.size === mainValuesCount;
    }, [hiddenMainValues, settings.intervals, settings.step]);

    // Gestion des changements d'état de la ligne graduée
    const handleStateChange = (stateType, newState) => {
        switch (stateType) {
            case "values":
                setValues(newState);
                break;
            case "hiddenMainValues":
                setHiddenMainValues(newState);
                break;
            case "arrows":
                setArrows(newState);
                break;
        }
    };

    // Gestion des changements de configuration
    const handleSettingsChange = (newSettings) => {
        // Assurons-nous que l'intervalle est valide
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

    // Ajoute une valeur à la ligne graduée
    const handleAddValue = (value) => {
        setValues((prev) => {
            const newValues = new Set(prev);
            newValues.add(value);
            return newValues;
        });
    };

    // Valeurs sélectionnées sous forme de tableau
    const selectedValuesArray = useMemo(() => {
        return Array.from(values).sort((a, b) => a - b);
    }, [values]);

    return (
        <>
            <Navbar appName="Chronix" />
            <div className="container mx-auto p-4 pt-20">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Chronix - Manipulation des mesures de temps
                </h1>

                {/* Section de la ligne graduée */}
                <div className="mb-8">
                    <TimeGraduatedLine
                        settings={settings}
                        values={values}
                        hiddenMainValues={hiddenMainValues}
                        arrows={arrows}
                        onStateChange={handleStateChange}
                    />
                </div>

                {/* Panneau principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Colonne des paramètres */}
                    <div>
                        <TimeControlPanel
                            settings={settings}
                            onSettingsChange={handleSettingsChange}
                            onResetDisplay={resetDisplay}
                            onHideMainValues={hideAllMainValues}
                            onShowMainValues={showAllMainValues}
                            areAllMainValuesHidden={areAllMainValuesHidden}
                        />
                    </div>

                    {/* Colonne centrale: Affichage et calcul de durée */}
                    <div className="space-y-6">
                        <TimeDisplay
                            values={selectedValuesArray}
                            settings={settings}
                        />

                        <TimeDurationCalculator
                            selectedValues={selectedValuesArray}
                            settings={settings}
                        />
                    </div>

                    {/* Colonne des opérations */}
                    <div>
                        <TimeOperations
                            selectedValues={selectedValuesArray}
                            settings={settings}
                            onAddValue={handleAddValue}
                        />
                    </div>
                </div>

                {/* Section d'aide et d'explication didactique */}
                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">
                        Guide d&lsquo;utilisation
                    </h2>

                    <div className="space-y-4 text-gray-700">
                        <div>
                            <h3 className="font-semibold text-lg">
                                Comment utiliser cette ligne graduée temporelle
                                ?
                            </h3>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>
                                    Cliquez <strong>au-dessus</strong> de la
                                    ligne pour afficher ou masquer une valeur
                                    temporelle
                                </li>
                                <li>
                                    Cliquez <strong>en-dessous</strong> de la
                                    ligne pour placer une flèche rouge
                                </li>
                                <li>
                                    Utilisez le panneau de contrôle pour changer
                                    l&lsquo;unité, les intervalles et le format
                                    d&lsquo;affichage
                                </li>
                                <li>
                                    Sélectionnez deux points pour mesurer
                                    automatiquement une durée
                                </li>
                                <li>
                                    Effectuez des opérations temporelles
                                    (addition, soustraction, etc.) avec les
                                    valeurs sélectionnées
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">
                                Applications pédagogiques
                            </h3>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>
                                    Visualisation de durées et d&lsquo;horaires
                                </li>
                                <li>Calcul d&lsquo;intervalles de temps</li>
                                <li>
                                    Conversion entre différentes unités
                                    temporelles
                                </li>
                                <li>
                                    Résolution de problèmes impliquant le temps
                                </li>
                                <li>
                                    Représentation des fractions de temps (quart
                                    d&lsquo;heure, demi-journée...)
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
