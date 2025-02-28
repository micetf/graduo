import { useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import { formatTimeValue } from "../utils/timeUtils";
import { convertTime } from "../utils/timeConverter";

/**
 * Composant pour calculer et afficher des durées entre deux points temporels
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.selectedValues - Les valeurs sélectionnées sur la ligne graduée
 * @param {Object} props.settings - Les paramètres de configuration
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {string} props.selectionMode - Mode de sélection (normal ou selection)
 * @returns {JSX.Element} Le composant TimeDurationCalculator
 */
const TimeDurationCalculator = memo(
    ({
        selectedValues,
        settings,
        className = "",
        selectionMode = "normal",
    }) => {
        const [calculations, setCalculations] = useState({
            duration: 0,
            startTime: null,
            endTime: null,
            hasValidSelection: false,
        });

        // Recalcule la durée lorsque les valeurs sélectionnées changent
        useEffect(() => {
            // Vérifie s'il y a exactement deux valeurs sélectionnées
            if (selectedValues.length === 2) {
                const sortedValues = [...selectedValues].sort((a, b) => a - b);
                const duration = Math.abs(sortedValues[1] - sortedValues[0]);

                setCalculations({
                    duration,
                    startTime: sortedValues[0],
                    endTime: sortedValues[1],
                    hasValidSelection: true,
                });
            } else {
                setCalculations({
                    duration: 0,
                    startTime: null,
                    endTime: null,
                    hasValidSelection: false,
                });
            }
        }, [selectedValues]);

        // Si aucune durée valide n'est calculable
        if (!calculations.hasValidSelection) {
            return (
                <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
                    <div className="text-center text-gray-500">
                        <p>
                            {selectionMode === "selection"
                                ? "Sélectionnez exactement deux points sur la ligne graduée pour calculer une durée."
                                : "Passez en mode sélection pour pouvoir calculer des durées entre deux points."}
                        </p>
                    </div>
                </div>
            );
        }

        // Calcule les conversions entre différentes unités de temps
        const conversions = [
            { unit: "second", label: "Secondes" },
            { unit: "minute", label: "Minutes" },
            { unit: "hour", label: "Heures" },
            { unit: "day", label: "Jours" },
        ]
            .map((item) => ({
                ...item,
                value: convertTime(
                    calculations.duration,
                    settings.timeUnit,
                    item.unit
                ),
            }))
            .filter((item) => item.value > 0 && item.value < 1000000); // Filtrer les valeurs pertinentes

        return (
            <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
                <h2 className="text-lg font-semibold border-b pb-2 mb-3">
                    Calcul de durée
                </h2>

                <div className="space-y-4">
                    {/* Information principale sur la durée */}
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                        <div className="text-sm text-blue-700 mb-1">Durée:</div>
                        <div className="text-xl font-mono text-blue-800">
                            {formatTimeValue(calculations.duration, settings)}
                        </div>
                    </div>

                    {/* Points de début et fin */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            <div className="text-sm text-gray-500">
                                Point de départ:
                            </div>
                            <div className="text-lg font-mono">
                                {formatTimeValue(
                                    calculations.startTime,
                                    settings
                                )}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                            <div className="text-sm text-gray-500">
                                Point d&lsquo;arrivée:
                            </div>
                            <div className="text-lg font-mono">
                                {formatTimeValue(
                                    calculations.endTime,
                                    settings
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Conversions entre unités */}
                    {conversions.length > 1 && (
                        <div className="mt-4">
                            <div className="text-sm font-medium text-gray-700 mb-2">
                                Conversions:
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {conversions.map((conversion, index) => (
                                    <div
                                        key={`conv-${index}`}
                                        className="bg-gray-50 p-2 rounded border border-gray-200"
                                    >
                                        <span className="text-gray-500 text-sm">
                                            {conversion.label}:
                                        </span>{" "}
                                        <span className="font-mono">
                                            {conversion.value.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Visualisation de la durée (barre de progression simple) */}
                    <div className="mt-3">
                        <div className="text-sm text-gray-500 mb-1">
                            Représentation visuelle:
                        </div>
                        <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        (calculations.duration /
                                            ((settings.intervals[1] -
                                                settings.intervals[0]) *
                                                0.5)) *
                                            100
                                    )}%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0</span>
                            <span>
                                {(settings.intervals[1] -
                                    settings.intervals[0]) /
                                    2}{" "}
                                {settings.timeUnit}s
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

TimeDurationCalculator.propTypes = {
    selectedValues: PropTypes.array.isRequired,
    settings: PropTypes.shape({
        timeUnit: PropTypes.string.isRequired,
        displayFormat: PropTypes.string.isRequired,
        intervals: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
    className: PropTypes.string,
    selectionMode: PropTypes.oneOf(["normal", "selection"]),
};

TimeDurationCalculator.displayName = "TimeDurationCalculator";

export default TimeDurationCalculator;
