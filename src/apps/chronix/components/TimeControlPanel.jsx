import { memo } from "react";
import PropTypes from "prop-types";

/**
 * Panneau de contrôle adapté aux mesures de temps
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.settings - Paramètres actuels de la ligne temporelle
 * @param {Function} props.onSettingsChange - Fonction de mise à jour des paramètres
 * @param {Function} props.onResetDisplay - Fonction de réinitialisation de l'affichage
 * @param {Function} props.onHideMainValues - Fonction pour masquer toutes les graduations principales
 * @param {Function} props.onShowMainValues - Fonction pour afficher toutes les graduations principales
 * @param {boolean} props.areAllMainValuesHidden - Indique si toutes les graduations principales sont masquées
 * @param {string} props.selectionMode - Mode de sélection actuel ("normal" ou "comparison")
 * @param {Function} props.onToggleSelectionMode - Fonction pour basculer le mode de sélection
 * @returns {JSX.Element} Le composant TimeControlPanel
 */
const TimeControlPanel = memo(
    ({
        settings,
        onSettingsChange,
        onResetDisplay,
        onHideMainValues,
        onShowMainValues,
        areAllMainValuesHidden,
        selectionMode,
        onToggleSelectionMode,
    }) => {
        // Gestion des unités de temps et configurations associées
        const timeUnits = [
            {
                value: "second",
                label: "Secondes",
                maxInterval: 60, // 0-60 secondes (une minute)
                defaultStep: 10, // pas de 10 secondes
                defaultDenominator: 10, // Pour les dixièmes de seconde
                subdivisions: 10, // Pour avoir des subdivisions de 1 seconde
            },
            {
                value: "minute",
                label: "Minutes",
                maxInterval: 60, // 0-60 minutes (une heure)
                defaultStep: 5, // Pas de 5 minutes
                defaultDenominator: 60, // Pour les secondes dans une minute
                subdivisions: 5, // Pour avoir des subdivisions de 1 minute
            },
            {
                value: "hour",
                label: "Heures",
                maxInterval: 24, // 0-24 heures (une journée)
                defaultStep: 1, // Pas de 1 heure
                defaultDenominator: 60, // Pour les minutes dans une heure
                subdivisions: 4, // Pour avoir des subdivisions de 15 minutes
            },
            {
                value: "day",
                label: "Jours",
                maxInterval: 30, // 1-30 jours (un mois)
                defaultStep: 1, // Pas de 1 jour
                defaultDenominator: 24, // Pour les heures dans une journée
                subdivisions: 4, // Pour avoir des subdivisions de 6 heures
            },
        ];

        // Fonction pour changer l'unité de temps
        const handleTimeUnitChange = (newUnit) => {
            const selectedUnit = timeUnits.find(
                (unit) => unit.value === newUnit
            );

            if (!selectedUnit) return;

            // Adapt intervals and step based on the selected time unit
            const newSettings = {
                ...settings,
                timeUnit: newUnit,
                intervals: [0, selectedUnit.maxInterval], // Utilise l'intervalle recommandé
                step: selectedUnit.defaultStep, // Utilise le pas recommandé
                denominator: selectedUnit.defaultDenominator, // Utilise le dénominateur recommandé
            };

            // Cas spécial pour les jours: on commence à 1 au lieu de 0
            if (newUnit === "day") {
                newSettings.intervals = [1, selectedUnit.maxInterval];
            }

            onSettingsChange(newSettings);
        };

        // Gestion du changement d'intervalle
        const handleIntervalChange = (event, index) => {
            const currentUnit = timeUnits.find(
                (unit) => unit.value === settings.timeUnit
            );
            const maxValue = currentUnit ? currentUnit.maxInterval : 60;

            const rawValue = Number(event.target.value);
            const newValue = Math.max(0, Math.min(maxValue, rawValue));
            const newIntervals = [...settings.intervals];

            if (index === 0 && newValue >= settings.intervals[1]) return;
            if (index === 1 && newValue <= settings.intervals[0]) return;

            newIntervals[index] = newValue;
            onSettingsChange({
                ...settings,
                intervals: newIntervals,
            });
        };

        // Gestion du pas de temps
        const getStepOptions = () => {
            switch (settings.timeUnit) {
                case "second":
                    return [1, 5, 10, 15, 30]; // 10 est le pas recommandé
                case "minute":
                    return [1, 5, 10, 15, 30]; // 5 est le pas recommandé
                case "hour":
                    return [0.25, 0.5, 1, 2, 3, 6, 12]; // 1 est le pas recommandé
                case "day":
                    return [0.5, 1, 2, 7, 14]; // 1 est le pas recommandé
                default:
                    return [1, 5, 10];
            }
        };

        // Fonction pour obtenir le libellé de l'unité de temps
        const getTimeUnitLabel = (unitValue) => {
            const unit = timeUnits.find((unit) => unit.value === unitValue);
            return unit ? unit.label : unitValue;
        };

        return (
            <div className="bg-white p-4 rounded-lg shadow space-y-6">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">
                        Paramètres temporels
                    </h2>

                    {/* Sélection de l'unité de temps */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unité de temps
                        </label>
                        <select
                            value={settings.timeUnit}
                            onChange={(e) =>
                                handleTimeUnitChange(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            {timeUnits.map((unit) => (
                                <option key={unit.value} value={unit.value}>
                                    {unit.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Intervalles */}
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Début
                            </label>
                            <input
                                type="number"
                                value={settings.intervals[0]}
                                min="0"
                                onChange={(e) => handleIntervalChange(e, 0)}
                                className="w-24 border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fin
                            </label>
                            <input
                                type="number"
                                value={settings.intervals[1]}
                                min="1"
                                onChange={(e) => handleIntervalChange(e, 1)}
                                className="w-24 border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                    </div>

                    {/* Pas de temps */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pas de temps
                        </label>
                        <select
                            value={settings.step}
                            onChange={(e) =>
                                onSettingsChange({
                                    ...settings,
                                    step: Number(e.target.value),
                                })
                            }
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            {getStepOptions().map((step) => (
                                <option key={step} value={step}>
                                    {step}{" "}
                                    {step === 1
                                        ? getTimeUnitLabel(
                                              settings.timeUnit
                                          ).replace(/s$/, "")
                                        : `${getTimeUnitLabel(
                                              settings.timeUnit
                                          )}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Format d'affichage */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Format d&lsquo;affichage
                        </label>
                        <select
                            value={settings.displayFormat}
                            onChange={(e) =>
                                onSettingsChange({
                                    ...settings,
                                    displayFormat: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="mixed">
                                Format mixte (1h 30min)
                            </option>
                            <option value="decimal">
                                Format décimal (1.5h)
                            </option>
                            <option value="digital">
                                Format digital (01:30:00)
                            </option>
                        </select>
                    </div>
                </div>

                {/* Mode de sélection */}
                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Mode d&apos;interaction
                    </h3>
                    <button
                        onClick={onToggleSelectionMode}
                        className={`w-full mb-3 py-2 px-4 rounded transition-colors border ${
                            selectionMode === "selection"
                                ? "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-indigo-300"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                        }`}
                        title="Basculer entre les modes d'interaction"
                    >
                        {selectionMode === "selection"
                            ? "Mode sélection (actif)"
                            : "Mode affichage (actif)"}
                    </button>
                    <div className="text-xs text-gray-500 mb-3">
                        {selectionMode === "selection"
                            ? "En mode sélection, cliquez sur n'importe quelle valeur pour la sélectionner ou la désélectionner, sans modifier son affichage."
                            : "En mode affichage, cliquez sur une graduation principale pour l'afficher ou la masquer, et cliquez sur une sous-graduation pour la sélectionner."}
                    </div>
                </div>

                {/* Actions de la ligne graduée */}
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
                            Réinitialiser l&rsquo;affichage
                        </button>
                    </div>
                </div>
            </div>
        );
    }
);

TimeControlPanel.propTypes = {
    settings: PropTypes.shape({
        notation: PropTypes.string.isRequired,
        intervals: PropTypes.arrayOf(PropTypes.number).isRequired,
        denominator: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        timeUnit: PropTypes.string.isRequired,
        displayFormat: PropTypes.string.isRequired,
    }).isRequired,
    onSettingsChange: PropTypes.func.isRequired,
    onResetDisplay: PropTypes.func.isRequired,
    onHideMainValues: PropTypes.func.isRequired,
    onShowMainValues: PropTypes.func.isRequired,
    areAllMainValuesHidden: PropTypes.bool.isRequired,
    selectionMode: PropTypes.string.isRequired,
    onToggleSelectionMode: PropTypes.func.isRequired,
};

TimeControlPanel.displayName = "TimeControlPanel";

export default TimeControlPanel;
