import { useState, memo } from "react";
import PropTypes from "prop-types";
import { formatTimeValue } from "../utils/timeUtils";
import { convertTime } from "../utils/timeConverter";

/**
 * Composant pour effectuer des opérations sur les valeurs temporelles
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.selectedValues - Les valeurs sélectionnées sur la ligne graduée
 * @param {Object} props.settings - Les paramètres de configuration
 * @param {Function} props.onAddValue - Callback quand une nouvelle valeur est ajoutée
 * @param {string} props.className - Classes CSS supplémentaires
 * @returns {JSX.Element} Le composant TimeOperations
 */
const TimeOperations = memo(
    ({ selectedValues, settings, onAddValue, className = "" }) => {
        const [operation, setOperation] = useState("addition");
        const [customValue, setCustomValue] = useState(1);
        const [customUnit, setCustomUnit] = useState(settings.timeUnit);
        const [result, setResult] = useState(null);

        // La valeur de référence est soit la valeur sélectionnée, soit la dernière valeur calculée
        const referenceValue =
            selectedValues.length > 0 ? selectedValues[0] : null;

        // Effectue l'opération temporelle demandée
        const performOperation = () => {
            if (referenceValue === null) {
                return;
            }

            // Convertir la valeur personnalisée dans l'unité de la ligne graduée
            const convertedValue = convertTime(
                customValue,
                customUnit,
                settings.timeUnit
            );

            let newValue;
            switch (operation) {
                case "addition":
                    newValue = referenceValue + convertedValue;
                    break;
                case "subtraction":
                    newValue = referenceValue - convertedValue;
                    break;
                case "multiplication":
                    newValue = referenceValue * customValue; // On multiplie par un facteur sans unité
                    break;
                case "division":
                    if (customValue === 0) return; // Éviter la division par zéro
                    newValue = referenceValue / customValue; // On divise par un facteur sans unité
                    break;
                default:
                    return;
            }

            // S'assurer que le résultat reste dans les limites de la ligne graduée
            newValue = Math.max(
                settings.intervals[0],
                Math.min(settings.intervals[1], newValue)
            );

            setResult(newValue);
        };

        // Ajoute le résultat à la ligne graduée
        const addResultToGraduatedLine = () => {
            if (result !== null && onAddValue) {
                onAddValue(result);
            }
        };

        return (
            <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
                <h2 className="text-lg font-semibold border-b pb-2 mb-3">
                    Opérations temporelles
                </h2>

                <div className="space-y-4">
                    {/* Sélection de la valeur de référence */}
                    <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                            Valeur de référence:
                        </div>
                        {referenceValue !== null ? (
                            <div className="bg-gray-50 p-2 rounded border border-gray-200">
                                <span className="font-mono">
                                    {formatTimeValue(referenceValue, settings)}
                                </span>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic">
                                Sélectionnez une valeur sur la ligne graduée
                                comme référence.
                            </div>
                        )}
                    </div>

                    {/* Type d'opération */}
                    <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                            Opération:
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => setOperation("addition")}
                                className={`p-2 rounded border ${
                                    operation === "addition"
                                        ? "bg-blue-100 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700"
                                }`}
                            >
                                Addition (+)
                            </button>
                            <button
                                onClick={() => setOperation("subtraction")}
                                className={`p-2 rounded border ${
                                    operation === "subtraction"
                                        ? "bg-blue-100 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700"
                                }`}
                            >
                                Soustraction (-)
                            </button>
                            <button
                                onClick={() => setOperation("multiplication")}
                                className={`p-2 rounded border ${
                                    operation === "multiplication"
                                        ? "bg-blue-100 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700"
                                }`}
                            >
                                Multiplication (×)
                            </button>
                            <button
                                onClick={() => setOperation("division")}
                                className={`p-2 rounded border ${
                                    operation === "division"
                                        ? "bg-blue-100 border-blue-300 text-blue-700"
                                        : "bg-gray-50 border-gray-200 text-gray-700"
                                }`}
                            >
                                Division (÷)
                            </button>
                        </div>
                    </div>

                    {/* Valeur personnalisée */}
                    <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">
                            Valeur personnalisée:
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={customValue}
                                onChange={(e) =>
                                    setCustomValue(
                                        parseFloat(e.target.value) || 0
                                    )
                                }
                                min="0"
                                step="0.1"
                                className="border border-gray-300 rounded p-2 flex-grow"
                            />
                            {(operation === "addition" ||
                                operation === "subtraction") && (
                                <select
                                    value={customUnit}
                                    onChange={(e) =>
                                        setCustomUnit(e.target.value)
                                    }
                                    className="border border-gray-300 rounded p-2"
                                >
                                    <option value="second">secondes</option>
                                    <option value="minute">minutes</option>
                                    <option value="hour">heures</option>
                                    <option value="day">jours</option>
                                </select>
                            )}
                        </div>
                    </div>

                    {/* Bouton de calcul */}
                    <div>
                        <button
                            onClick={performOperation}
                            disabled={referenceValue === null}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Calculer
                        </button>
                    </div>

                    {/* Résultat */}
                    {result !== null && (
                        <div>
                            <div className="text-sm font-medium text-gray-700 mb-2">
                                Résultat:
                            </div>
                            <div className="bg-green-50 p-3 rounded border border-green-200 flex justify-between items-center">
                                <span className="font-mono text-lg">
                                    {formatTimeValue(result, settings)}
                                </span>
                                <button
                                    onClick={addResultToGraduatedLine}
                                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                                    title="Ajouter à la ligne graduée"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

TimeOperations.propTypes = {
    selectedValues: PropTypes.array.isRequired,
    settings: PropTypes.shape({
        timeUnit: PropTypes.string.isRequired,
        displayFormat: PropTypes.string.isRequired,
        intervals: PropTypes.arrayOf(PropTypes.number).isRequired,
    }).isRequired,
    onAddValue: PropTypes.func,
    className: PropTypes.string,
};

TimeOperations.displayName = "TimeOperations";

export default TimeOperations;
