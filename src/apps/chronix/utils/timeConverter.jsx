/**
 * Utilitaires pour la conversion des valeurs temporelles
 */

// Constantes de conversion
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const SECONDS_IN_DAY = SECONDS_IN_HOUR * HOURS_IN_DAY;

/**
 * Convertit une valeur de temps entre différentes unités
 * @param {number} value - La valeur à convertir
 * @param {string} fromUnit - L'unité de départ
 * @param {string} toUnit - L'unité d'arrivée
 * @returns {number} La valeur convertie
 */
export const convertTime = (value, fromUnit, toUnit) => {
    if (fromUnit === toUnit) return value;

    // D'abord conversion en secondes
    let seconds = 0;
    switch (fromUnit) {
        case "second":
            seconds = value;
            break;
        case "minute":
            seconds = value * SECONDS_IN_MINUTE;
            break;
        case "hour":
            seconds = value * SECONDS_IN_HOUR;
            break;
        case "day":
            seconds = value * SECONDS_IN_DAY;
            break;
        default:
            seconds = value;
    }

    // Ensuite conversion vers l'unité cible
    switch (toUnit) {
        case "second":
            return seconds;
        case "minute":
            return seconds / SECONDS_IN_MINUTE;
        case "hour":
            return seconds / SECONDS_IN_HOUR;
        case "day":
            return seconds / SECONDS_IN_DAY;
        default:
            return value;
    }
};

/**
 * Convertit une valeur en un objet décomposé en différentes unités de temps
 * @param {number} value - La valeur à décomposer
 * @param {string} unit - L'unité de la valeur
 * @returns {Object} La valeur décomposée (jours, heures, minutes, secondes)
 */
export const decomposeTimeValue = (value, unit) => {
    // Convertir d'abord en secondes
    const totalSeconds = convertTime(value, unit, "second");

    // Puis décomposer en différentes unités
    const days = Math.floor(totalSeconds / SECONDS_IN_DAY);
    const remainingAfterDays = totalSeconds % SECONDS_IN_DAY;

    const hours = Math.floor(remainingAfterDays / SECONDS_IN_HOUR);
    const remainingAfterHours = remainingAfterDays % SECONDS_IN_HOUR;

    const minutes = Math.floor(remainingAfterHours / SECONDS_IN_MINUTE);
    const seconds = Math.floor(remainingAfterHours % SECONDS_IN_MINUTE);

    // Millisecondes ou fractions de seconde (si besoin)
    const milliseconds = Math.round(
        (totalSeconds - Math.floor(totalSeconds)) * 1000
    );

    return {
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        // Valeurs totales dans différentes unités (utile pour les calculs)
        totalDays: totalSeconds / SECONDS_IN_DAY,
        totalHours: totalSeconds / SECONDS_IN_HOUR,
        totalMinutes: totalSeconds / SECONDS_IN_MINUTE,
        totalSeconds,
    };
};

/**
 * Obtient le pas de temps approprié pour une unité donnée
 * @param {string} unit - L'unité de temps
 * @returns {Object} Tableau des pas de temps possibles
 */
export const getTimeSteps = (unit) => {
    switch (unit) {
        case "second":
            return [1, 5, 10, 15, 30];
        case "minute":
            return [1, 5, 10, 15, 30];
        case "hour":
            return [0.25, 0.5, 1, 2, 3, 6, 12];
        case "day":
            return [0.5, 1, 2, 7, 14];
        default:
            return [1, 5, 10];
    }
};

/**
 * Calcule les intervalles de temps pour la ligne graduée
 * @param {number} start - Valeur de début
 * @param {number} end - Valeur de fin
 * @param {string} unit - Unité de temps
 * @returns {Array} Intervalles calculés
 */
export const calculateTimeIntervals = (start, end, unit) => {
    const range = end - start;

    // Si la plage est trop petite, utiliser la valeur par défaut
    if (range <= 0) {
        return [0, getDefaultEndValue(unit)];
    }

    // Ajuster les intervalles pour qu'ils soient "propres"
    return [
        roundToNiceTimeValue(start, unit, "floor"),
        roundToNiceTimeValue(end, unit, "ceil"),
    ];
};

/**
 * Arrondit une valeur de temps à une valeur "propre"
 * @param {number} value - La valeur à arrondir
 * @param {string} unit - L'unité de temps
 * @param {string} direction - Direction d'arrondi ('floor', 'ceil', 'round')
 * @returns {number} Valeur arrondie
 */
export const roundToNiceTimeValue = (value, unit, direction = "round") => {
    let factor = 1;

    switch (unit) {
        case "second":
            // Arrondir aux 5 secondes
            factor = 5;
            break;
        case "minute":
            // Arrondir aux 5 minutes
            factor = 5;
            break;
        case "hour":
            // Arrondir aux 0.5 heures (30 minutes)
            factor = 0.5;
            break;
        case "day":
            // Arrondir aux jours entiers
            factor = 1;
            break;
    }

    // Appliquer l'arrondi dans la direction spécifiée
    if (direction === "floor") {
        return Math.floor(value / factor) * factor;
    } else if (direction === "ceil") {
        return Math.ceil(value / factor) * factor;
    }
    return Math.round(value / factor) * factor;
};

/**
 * Obtient la valeur de fin par défaut pour une unité donnée
 * @param {string} unit - L'unité de temps
 * @returns {number} Valeur de fin par défaut
 */
export const getDefaultEndValue = (unit) => {
    switch (unit) {
        case "second":
            return 60; // 1 minute
        case "minute":
            return 60; // 1 heure
        case "hour":
            return 12; // 12 heures
        case "day":
            return 7; // 1 semaine
        default:
            return 10;
    }
};
