import { memo } from "react";
import PropTypes from "prop-types";
import { Settings, Clock, AlignLeft } from "lucide-react";

/**
 * Panneau de contrôle adapté aux mesures de temps, version allégée
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.settings - Paramètres actuels de la ligne temporelle
 * @param {Function} props.onSettingsChange - Fonction de mise à jour des paramètres
 * @returns {JSX.Element} Le composant TimeControlPanel
 */
const TimeControlPanel = memo(({ settings, onSettingsChange }) => {
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
        const selectedUnit = timeUnits.find((unit) => unit.value === newUnit);

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
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <div className="flex items-center mb-4">
                <Settings className="h-5 w-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold">Paramètres</h2>
            </div>

            {/* Groupe: Unité et intervalle */}
            <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                <div className="flex items-center mb-1">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">
                        Unité temporelle
                    </span>
                </div>

                {/* Sélection de l'unité de temps */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
                        Unité
                    </label>
                    <select
                        value={settings.timeUnit}
                        onChange={(e) => handleTimeUnitChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    >
                        {timeUnits.map((unit) => (
                            <option key={unit.value} value={unit.value}>
                                {unit.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Intervalles */}
                <div className="flex gap-3">
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Début
                        </label>
                        <input
                            type="number"
                            value={settings.intervals[0]}
                            min="0"
                            onChange={(e) => handleIntervalChange(e, 0)}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            Fin
                        </label>
                        <input
                            type="number"
                            value={settings.intervals[1]}
                            min="1"
                            onChange={(e) => handleIntervalChange(e, 1)}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Groupe: Affichage */}
            <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                <div className="flex items-center mb-1">
                    <AlignLeft className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">
                        Affichage
                    </span>
                </div>

                {/* Pas de temps */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
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
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    >
                        {getStepOptions().map((step) => (
                            <option key={step} value={step}>
                                {step}{" "}
                                {step === 1
                                    ? getTimeUnitLabel(
                                          settings.timeUnit
                                      ).replace(/s$/, "")
                                    : `${getTimeUnitLabel(settings.timeUnit)}`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Format d'affichage */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1">
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
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                    >
                        <option value="mixed">Format mixte (1h 30min)</option>
                        <option value="decimal">Format décimal (1.5h)</option>
                        <option value="digital">
                            Format digital (01:30:00)
                        </option>
                    </select>
                </div>
            </div>
        </div>
    );
});

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
};

TimeControlPanel.displayName = "TimeControlPanel";

export default TimeControlPanel;
