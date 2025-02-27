// ControlPanel.jsx
import { memo } from "react";
import PropTypes from "prop-types";

/**
 * Panneau de contrôle pour la configuration de la ligne graduée
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.settings - Paramètres actuels de la ligne
 * @param {Function} props.onSettingsChange - Fonction de mise à jour des paramètres
 * @param {Function} props.onResetDisplay - Fonction de réinitialisation de l'affichage
 * @param {Function} props.onHideMainValues - Fonction pour masquer toutes les graduations principales
 * @param {Function} props.onShowMainValues - Fonction pour afficher toutes les graduations principales
 * @param {boolean} props.areAllMainValuesHidden - Indique si toutes les graduations principales sont masquées
 * @returns {JSX.Element} Le composant ControlPanel
 */
const ControlPanel = memo(
    ({
        settings,
        onSettingsChange,
        onResetDisplay,
        onHideMainValues,
        onShowMainValues,
        areAllMainValuesHidden,
    }) => {
        const handleIntervalChange = (event, index) => {
            const rawValue = Number(event.target.value);
            const newValue = Math.max(-100, Math.min(100, rawValue));
            const newIntervals = [...settings.intervals];

            if (index === 0 && newValue >= settings.intervals[1]) return;
            if (index === 1 && newValue <= settings.intervals[0]) return;

            newIntervals[index] = newValue;
            onSettingsChange({
                ...settings,
                intervals: newIntervals,
            });
        };

        return (
            <div className="bg-white p-4 rounded-lg shadow space-y-6">
                {/* Section des paramètres existante */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Paramètres</h2>
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Borne gauche
                            </label>
                            <input
                                type="number"
                                value={settings.intervals[0]}
                                min="-100"
                                max="99"
                                onChange={(e) => handleIntervalChange(e, 0)}
                                className="w-24 border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Borne droite
                            </label>
                            <input
                                type="number"
                                value={settings.intervals[1]}
                                min="-99"
                                max="100"
                                onChange={(e) => handleIntervalChange(e, 1)}
                                className="w-24 border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notation
                        </label>
                        <select
                            value={settings.notation}
                            onChange={(e) =>
                                onSettingsChange({
                                    ...settings,
                                    notation: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="decimal">Décimale</option>
                            <option value="fraction">Fractionnaire</option>
                            <option value="mixedNumber">Nombre mixte</option>
                        </select>
                    </div>

                    {(settings.notation === "fraction" ||
                        settings.notation === "mixedNumber") && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Dénominateur
                            </label>
                            <select
                                value={settings.denominator}
                                onChange={(e) =>
                                    onSettingsChange({
                                        ...settings,
                                        denominator: Number(e.target.value),
                                    })
                                }
                                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                {[2, 3, 4, 5, 6, 8, 10, 12].map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Nouvelle section des actions */}
                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Actions sur la ligne
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={
                                areAllMainValuesHidden
                                    ? onShowMainValues
                                    : onHideMainValues
                            }
                            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 
                                 py-2 px-4 rounded transition-colors border border-blue-200"
                        >
                            {areAllMainValuesHidden ? "Afficher" : "Masquer"}{" "}
                            les graduations principales
                        </button>

                        <button
                            onClick={onResetDisplay}
                            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 
                                 py-2 px-4 rounded transition-colors border border-gray-200"
                        >
                            Réinitialiser l&lsquo;affichage
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

ControlPanel.propTypes = {
    settings: PropTypes.shape({
        notation: PropTypes.oneOf(["decimal", "fraction", "mixedNumber"])
            .isRequired,
        intervals: PropTypes.arrayOf(PropTypes.number).isRequired,
        denominator: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
    }).isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    onResetDisplay: PropTypes.func.isRequired,
    onHideMainValues: PropTypes.func.isRequired,
    onShowMainValues: PropTypes.func.isRequired,
    areAllMainValuesHidden: PropTypes.bool.isRequired,
};

ControlPanel.displayName = "ControlPanel";

export default ControlPanel;
