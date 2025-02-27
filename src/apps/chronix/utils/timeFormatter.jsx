/**
 * Utilitaires pour le formatage des valeurs de temps sur la ligne graduée
 */

/**
 * Formate une valeur temporelle pour l'affichage sur la ligne graduée
 * @param {number} value - La valeur à formater
 * @param {Object} settings - Les paramètres de configuration
 * @param {CanvasRenderingContext2D} ctx - Le contexte de dessin du canvas
 * @param {number} x - La position x où dessiner
 * @param {number} y - La position y où dessiner
 */
export const formatTimeOnGraduation = (value, settings, ctx, x, y) => {
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const { timeUnit, displayFormat } = settings;

    // Utiliser un formatage spécifique pour la ligne graduée
    switch (timeUnit) {
        case "second":
            formatSecondValue(value, displayFormat, ctx, x, y);
            break;
        case "minute":
            formatMinuteValue(value, displayFormat, ctx, x, y);
            break;
        case "hour":
            formatHourValue(value, displayFormat, ctx, x, y);
            break;
        case "day":
            formatDayValue(value, displayFormat, ctx, x, y);
            break;
        default:
            ctx.fillText(value.toString(), x, y);
    }
};

/**
 * Formate une valeur en secondes
 */
const formatSecondValue = (seconds, displayFormat, ctx, x, y) => {
    switch (displayFormat) {
        case "digital": // Format mm:ss
        {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            ctx.fillText(
                `${mins.toString().padStart(2, "0")}:${secs
                    .toString()
                    .padStart(2, "0")}`,
                x,
                y
            );
            break;
        }
        case "decimal":
            if (seconds < 60) {
                ctx.fillText(`${seconds}s`, x, y);
            } else {
                const minutes = seconds / 60;
                ctx.fillText(`${minutes.toFixed(1)}min`, x, y);
            }
            break;
        case "mixed":
        default:
            if (seconds < 60) {
                ctx.fillText(`${seconds}s`, x, y);
            } else {
                const mins = Math.floor(seconds / 60);
                const remainingSecs = Math.floor(seconds % 60);
                if (remainingSecs === 0) {
                    ctx.fillText(`${mins}min`, x, y);
                } else {
                    // Affichage sur deux lignes pour la lisibilité
                    ctx.fillText(`${mins}min`, x, y);
                    ctx.fillText(`${remainingSecs}s`, x, y + 20);
                }
            }
    }
};

/**
 * Formate une valeur en minutes
 */
const formatMinuteValue = (minutes, displayFormat, ctx, x, y) => {
    switch (displayFormat) {
        case "digital": // Format hh:mm
        {
            const hours = Math.floor(minutes / 60);
            const mins = Math.floor(minutes % 60);
            ctx.fillText(
                `${hours.toString().padStart(2, "0")}:${mins
                    .toString()
                    .padStart(2, "0")}`,
                x,
                y
            );
            break;
        }
        case "decimal":
            if (minutes < 60) {
                ctx.fillText(`${minutes}min`, x, y);
            } else {
                const hours = minutes / 60;
                ctx.fillText(`${hours.toFixed(1)}h`, x, y);
            }
            break;
        case "mixed":
        default:
            if (minutes < 60) {
                ctx.fillText(`${minutes}min`, x, y);
            } else {
                const hrs = Math.floor(minutes / 60);
                const remainingMins = Math.floor(minutes % 60);
                if (remainingMins === 0) {
                    ctx.fillText(`${hrs}h`, x, y);
                } else {
                    // Affichage sur deux lignes pour la lisibilité
                    ctx.fillText(`${hrs}h`, x, y);
                    ctx.fillText(`${remainingMins}min`, x, y + 20);
                }
            }
    }
};

/**
 * Formate une valeur en heures
 */
const formatHourValue = (hours, displayFormat, ctx, x, y) => {
    switch (displayFormat) {
        case "digital": // Format simple pour les heures
        {
            const hrs = Math.floor(hours);
            const mins = Math.round((hours - hrs) * 60);
            ctx.fillText(
                `${hrs.toString().padStart(2, "0")}:${mins
                    .toString()
                    .padStart(2, "0")}`,
                x,
                y
            );
            break;
        }
        case "decimal":
            ctx.fillText(`${hours.toFixed(1)}h`, x, y);
            break;
        case "mixed":
        default: {
            const wholePart = Math.floor(hours);
            const minutePart = Math.round((hours - wholePart) * 60);

            if (minutePart === 0) {
                ctx.fillText(`${wholePart}h`, x, y);
            } else if (wholePart === 0) {
                ctx.fillText(`${minutePart}min`, x, y);
            } else {
                // Affichage sur deux lignes pour la lisibilité
                ctx.fillText(`${wholePart}h`, x, y);
                ctx.fillText(`${minutePart}min`, x, y + 20);
            }
        }
    }
};

/**
 * Formate une valeur en jours
 */
const formatDayValue = (days, displayFormat, ctx, x, y) => {
    switch (displayFormat) {
        case "digital": // Format pour les jours
        {
            const wholeDays = Math.floor(days);
            const hours = Math.round((days - wholeDays) * 24);
            ctx.fillText(
                `${wholeDays}j ${hours.toString().padStart(2, "0")}h`,
                x,
                y
            );
            break;
        }
        case "decimal":
            ctx.fillText(`${days.toFixed(1)}j`, x, y);
            break;
        case "mixed":
        default: {
            const dayPart = Math.floor(days);
            const hourPart = Math.round((days - dayPart) * 24);

            if (hourPart === 0) {
                ctx.fillText(`${dayPart}j`, x, y);
            } else if (dayPart === 0) {
                ctx.fillText(`${hourPart}h`, x, y);
            } else {
                // Affichage sur deux lignes pour la lisibilité
                ctx.fillText(`${dayPart}j`, x, y);
                ctx.fillText(`${hourPart}h`, x, y + 20);
            }
        }
    }
};

/**
 * Détermine les subdivisions temporelles appropriées
 * @param {Object} settings - Les paramètres de configuration
 * @returns {number} - Le nombre de subdivisions
 */
export const getTimeSubdivisions = (settings) => {
    const { timeUnit, denominator } = settings;

    // Si un dénominateur est explicitement défini, l'utiliser
    if (denominator) {
        return denominator;
    }

    // Sinon, utiliser les subdivisions standard pour chaque unité
    switch (timeUnit) {
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
 * Vérifie si une valeur correspond à une graduation principale
 * @param {number} value - La valeur à vérifier
 * @param {Object} settings - Les paramètres de configuration
 * @returns {boolean} - Vrai si c'est une graduation principale
 */
export const isMainTimeValue = (value, settings) => {
    const { step } = settings;

    // Vérifier si la valeur est un multiple du pas
    return Math.abs(value % step) < 0.001;
};
