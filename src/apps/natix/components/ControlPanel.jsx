// src/components/ControlPanel.jsx
import { memo } from "react";
import PropTypes from "prop-types";

/**
 * Panneau de contrôle pour la configuration de la ligne graduée
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.settings - Les paramètres actuels
 * @param {Function} props.onSettingsChange - Fonction de mise à jour des paramètres
 * @returns {JSX.Element} Le composant ControlPanel
 */
const ControlPanel = memo(({ settings, onSettingsChange }) => {
    /**
     * Gère les modifications des bornes de la ligne graduée
     * @param {Event} event - Événement de modification
     * @param {number} index - Index de la borne (0: gauche, 1: droite)
     */
    const handleIntervalChange = (event, index) => {
        const newValue = Number(event.target.value);
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
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Paramètres</h2>
            <div className="space-y-4">
                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Borne gauche
                        </label>
                        <input
                            type="number"
                            value={settings.intervals[0]}
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
        </div>
    );
});

ControlPanel.propTypes = {
    settings: PropTypes.shape({
        notation: PropTypes.oneOf(["decimal", "fraction", "mixedNumber"])
            .isRequired,
        intervals: PropTypes.arrayOf(PropTypes.number).isRequired,
        denominator: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
    }).isRequired,
    onSettingsChange: PropTypes.func.isRequired,
};

ControlPanel.displayName = "ControlPanel";

export default ControlPanel;
