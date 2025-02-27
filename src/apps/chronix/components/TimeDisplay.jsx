import { memo } from "react";
import PropTypes from "prop-types";
import { formatTimeValue } from "../utils/timeUtils";

/**
 * Composant pour afficher les valeurs de temps sélectionnées
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.values - Les valeurs de temps sélectionnées
 * @param {Object} props.settings - Les paramètres de configuration
 * @param {string} props.className - Classes CSS supplémentaires
 * @returns {JSX.Element} Le composant TimeDisplay
 */
const TimeDisplay = memo(({ values, settings, className = "" }) => {
    // Si aucune valeur n'est sélectionnée
    if (!values.length) {
        return (
            <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
                <p className="text-gray-500 text-center">
                    Cliquez sur la ligne graduée pour sélectionner des valeurs
                    de temps.
                </p>
            </div>
        );
    }

    // Calculer la différence entre deux valeurs si exactement deux sont sélectionnées
    const showDifference = values.length === 2;
    const timeDifference = showDifference
        ? Math.abs(values[0] - values[1])
        : null;

    return (
        <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold border-b pb-2">
                    Valeurs de temps sélectionnées
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {values
                        .sort((a, b) => a - b)
                        .map((value, index) => (
                            <div
                                key={`time-${index}`}
                                className="bg-gray-50 p-3 rounded-md border border-gray-200"
                            >
                                <div className="text-sm text-gray-500">
                                    Valeur {index + 1}:
                                </div>
                                <div className="text-xl font-mono">
                                    {formatTimeValue(value, settings)}
                                </div>
                            </div>
                        ))}
                </div>

                {/* Affichage de la différence de temps si applicable */}
                {showDifference && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                        <div className="text-sm text-blue-700">
                            Différence de temps:
                        </div>
                        <div className="text-xl font-mono text-blue-800">
                            {formatTimeValue(timeDifference, settings)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
});

TimeDisplay.propTypes = {
    values: PropTypes.array.isRequired,
    settings: PropTypes.shape({
        timeUnit: PropTypes.string.isRequired,
        displayFormat: PropTypes.string.isRequired,
    }).isRequired,
    className: PropTypes.string,
};

TimeDisplay.displayName = "TimeDisplay";

export default TimeDisplay;
