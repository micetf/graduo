/**
 * Formate une valeur de temps selon les paramètres de configuration
 * @param {number} value - La valeur de temps à formater
 * @param {Object} settings - Les paramètres de configuration
 * @returns {string} La valeur de temps formatée
 */
export const formatTimeValue = (value, settings) => {
    const { timeUnit, displayFormat } = settings;

    switch (displayFormat) {
        case "digital":
            return formatDigitalTime(value, timeUnit);
        case "decimal":
            return formatDecimalTime(value, timeUnit);
        case "mixed":
        default:
            return formatMixedTime(value, timeUnit);
    }
};

/**
 * Formate une valeur de temps au format digital (HH:MM:SS)
 * @param {number} value - La valeur de temps à formater
 * @param {string} unit - L'unité de la valeur de temps
 * @returns {string} La valeur de temps au format digital
 */
export const formatDigitalTime = (value, unit) => {
    let hours = 0,
        minutes = 0,
        seconds = 0;

    switch (unit) {
        case "second":
            seconds = value;
            minutes = Math.floor(seconds / 60);
            seconds %= 60;
            hours = Math.floor(minutes / 60);
            minutes %= 60;
            break;
        case "minute":
            minutes = value;
            hours = Math.floor(minutes / 60);
            minutes %= 60;
            break;
        case "hour":
            hours = Math.floor(value);
            minutes = Math.round((value - hours) * 60);
            break;
        case "day":
            hours = value * 24;
            break;
    }

    // Format avec des zéros de remplissage
    const pad = (num) => String(num).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

/**
 * Formate une valeur de temps au format décimal
 * @param {number} value - La valeur de temps à formater
 * @param {string} unit - L'unité de la valeur de temps
 * @returns {string} La valeur de temps au format décimal
 */
export const formatDecimalTime = (value, unit) => {
    let result;

    switch (unit) {
        case "second":
            if (value < 60) {
                result = `${value.toFixed(1)}s`;
            } else {
                result = `${(value / 60).toFixed(2)}min`;
            }
            break;
        case "minute":
            if (value < 60) {
                result = `${value.toFixed(1)}min`;
            } else {
                result = `${(value / 60).toFixed(2)}h`;
            }
            break;
        case "hour":
            result = `${value.toFixed(2)}h`;
            break;
        case "day":
            result = `${value.toFixed(2)}j`;
            break;
    }

    return result;
};

/**
 * Formate une valeur de temps au format mixte (1h 30min 45s)
 * @param {number} value - La valeur de temps à formater
 * @param {string} unit - L'unité de la valeur de temps
 * @returns {string} La valeur de temps au format mixte
 */
export const formatMixedTime = (value, unit) => {
    let days = 0,
        hours = 0,
        minutes = 0,
        seconds = 0;
    let fractionSeconds = 0;

    switch (unit) {
        case "second":
            seconds = Math.floor(value);
            fractionSeconds = Math.round((value - seconds) * 10);

            if (seconds >= 60) {
                minutes = Math.floor(seconds / 60);
                seconds %= 60;

                if (minutes >= 60) {
                    hours = Math.floor(minutes / 60);
                    minutes %= 60;
                }
            }
            break;
        case "minute":
            minutes = Math.floor(value);
            seconds = Math.round((value - minutes) * 60);

            if (minutes >= 60) {
                hours = Math.floor(minutes / 60);
                minutes %= 60;

                if (hours >= 24) {
                    days = Math.floor(hours / 24);
                    hours %= 24;
                }
            }
            break;
        case "hour":
            hours = Math.floor(value);
            minutes = Math.round((value - hours) * 60);

            if (hours >= 24) {
                days = Math.floor(hours / 24);
                hours %= 24;
            }
            break;
        case "day":
            days = Math.floor(value);
            hours = Math.round((value - days) * 24);
            break;
    }

    // Construction du résultat
    const parts = [];

    if (days > 0) {
        parts.push(`${days}j`);
    }

    if (hours > 0 || (days > 0 && (minutes > 0 || seconds > 0))) {
        parts.push(`${hours}h`);
    }

    if (minutes > 0 || (hours > 0 && seconds > 0)) {
        parts.push(`${minutes}min`);
    }

    if (seconds > 0 || (unit === "second" && value < 60)) {
        if (fractionSeconds > 0) {
            parts.push(`${seconds},${fractionSeconds}s`);
        } else {
            parts.push(`${seconds}s`);
        }
    }

    return parts.join(" ");
};

/**
 * Convertit une valeur de temps entre différentes unités
 * @param {number} value - La valeur à convertir
 * @param {string} fromUnit - L'unité de départ
 * @param {string} toUnit - L'unité d'arrivée
 * @returns {number} La valeur convertie
 */
export const convertTimeUnit = (value, fromUnit, toUnit) => {
    // Convertir d'abord en secondes
    let seconds;

    switch (fromUnit) {
        case "second":
            seconds = value;
            break;
        case "minute":
            seconds = value * 60;
            break;
        case "hour":
            seconds = value * 3600;
            break;
        case "day":
            seconds = value * 86400; // 24 * 60 * 60
            break;
        default:
            seconds = value;
    }

    // Puis convertir de secondes vers l'unité cible
    switch (toUnit) {
        case "second":
            return seconds;
        case "minute":
            return seconds / 60;
        case "hour":
            return seconds / 3600;
        case "day":
            return seconds / 86400;
        default:
            return seconds;
    }
};

/**
 * Obtient le nombre correct de subdivisions pour une unité de temps
 * @param {string} unit - L'unité de temps
 * @returns {number} Le nombre de subdivisions
 */
export const getTimeSubdivisions = (unit) => {
    switch (unit) {
        case "second":
            return 10; // Dixièmes de seconde
        case "minute":
            return 60; // 60 secondes dans une minute
        case "hour":
            return 60; // 60 minutes dans une heure
        case "day":
            return 24; // 24 heures dans une journée
        default:
            return 10;
    }
};

/**
 * Détermine l'unité d'affichage en fonction de la durée
 * @param {number} duration - La durée à analyser
 * @param {string} baseUnit - L'unité de base
 * @returns {string} L'unité d'affichage recommandée
 */
export const getBestDisplayUnit = (duration, baseUnit) => {
    if (baseUnit === "second") {
        if (duration >= 3600) return "hour";
        if (duration >= 60) return "minute";
        return "second";
    } else if (baseUnit === "minute") {
        if (duration >= 1440) return "day";
        if (duration >= 60) return "hour";
        return "minute";
    } else if (baseUnit === "hour") {
        if (duration >= 24) return "day";
        return "hour";
    }
    return baseUnit;
};

/**
/**
 * Arrondit une valeur temporelle à la graduation la plus proche
 * @param {number} value - La valeur à arrondir
 * @param {Object} settings - Les paramètres de configuration
 * @returns {number} La valeur arrondie
 */
export const snapToTimeGraduation = (value, settings) => {
    const { timeUnit, step } = settings;

    // D'abord, vérifions si c'est déjà une graduation principale
    if (Math.abs(value % step) < 0.001) {
        return value; // Déjà sur une graduation principale
    }

    // Trouver la graduation principale inférieure et supérieure
    const lowerMain = Math.floor(value / step) * step;
    const upperMain = Math.ceil(value / step) * step;

    // Si la valeur est plus proche de la graduation principale inférieure ou supérieure
    // que de toute sous-graduation, on l'arrondit à cette graduation principale
    if (value - lowerMain < 0.1) return lowerMain;
    if (upperMain - value < 0.1) return upperMain;

    // Calculer les subdivisions pour déterminer les sous-graduations valides
    let subdivisions;
    switch (timeUnit) {
        case "second":
            subdivisions = 10; // Dixièmes de seconde
            break;
        case "minute":
            subdivisions = 60; // 60 secondes dans une minute
            break;
        case "hour":
            subdivisions = 60; // 60 minutes dans une heure
            break;
        case "day":
            subdivisions = 24; // 24 heures dans une journée
            break;
        default:
            subdivisions = 10;
    }

    // Pour les graduations standard avec step >= 1
    if (step >= 1) {
        // Déterminer la taille d'un intervalle entre deux sous-graduations
        const subStep = step / Math.min(subdivisions, 10); // Limiter pour éviter trop de sous-graduations

        // Arrondir à la sous-graduation la plus proche
        return Math.round(value / subStep) * subStep;
    }
    // Pour les pas fractionnaires (0.5h, 0.25j, etc.)
    else {
        return Math.round(value / step) * step;
    }
};
