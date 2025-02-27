/**
 * Utilitaires pour calculer les subdivisions adaptatives pour la ligne graduée temporelle
 */

/**
 * Trouve la subdivision naturelle la plus proche d'une valeur cible
 * @param {Array} naturalDivisions - Tableau des subdivisions naturelles possibles
 * @param {number} target - Nombre cible de subdivisions
 * @param {number} step - Pas de temps actuel
 * @returns {number} - Subdivision naturelle la plus appropriée
 * @private
 */
// eslint-disable-next-line no-unused-vars
const findClosestNaturalSubdivision = (naturalDivisions, target, step) => {
    // Si le pas est inférieur à 1, nous devons adapter les subdivisions
    if (step < 1) {
        // Pour les pas fractionnaires (ex: 0.5, 0.25), on utilise
        // des subdivisions différentes
        return step * 4; // Approche simple: diviser en 4 pour 0.25, 2 pour 0.5, etc.
    }

    // Pour les valeurs entières, on cherche la subdivision naturelle la plus proche
    // mais qui ne soit pas égale au pas lui-même
    const filtered = naturalDivisions.filter(
        (div) => div < step || step % div !== 0
    );

    if (filtered.length === 0) {
        return step === 1 ? 4 : step / 2; // Valeur par défaut raisonnable
    }

    // Trouver la valeur la plus proche de notre cible
    return filtered.reduce((prev, curr) => {
        return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
    }, filtered[0]);
};

/**
 * Détermine le nombre optimal de subdivisions pour une ligne graduée temporelle
 * @param {Object} settings - Paramètres de la ligne graduée
 * @returns {Object} - Informations sur les subdivisions optimales
 */
export const calculateOptimalTimeSubdivisions = (settings) => {
    const { timeUnit, step, intervals } = settings;
    const range = intervals[1] - intervals[0];

    // Déterminer le nombre optimal de subdivisions en fonction des recommandations pédagogiques
    let subdivisionCount;
    let subdivisionStep;

    // Configurations recommandées selon l'analyse pédagogique
    switch (timeUnit) {
        case "second":
            // Pour les secondes: subdivisions de 1 seconde
            if (step === 10) {
                // Pas recommandé de 10 secondes
                subdivisionCount = 10;
            } else if (step === 5) {
                subdivisionCount = 5;
            } else if (step === 15) {
                subdivisionCount = 15;
            } else if (step === 30) {
                subdivisionCount = 6; // Subdivisions de 5 secondes
            } else {
                // Pour les autres pas
                subdivisionCount = step;
            }
            break;

        case "minute":
            // Pour les minutes: subdivisions de 1 minute
            if (step === 5) {
                // Pas recommandé de 5 minutes
                subdivisionCount = 5;
            } else if (step === 10) {
                subdivisionCount = 10;
            } else if (step === 15) {
                subdivisionCount = 15;
            } else if (step === 30) {
                subdivisionCount = 6; // Subdivisions de 5 minutes
            } else {
                // Pour les autres pas
                subdivisionCount = step;
            }
            break;

        case "hour":
            // Pour les heures: subdivisions de 15 minutes (quarts d'heure)
            if (step === 1) {
                // Pas recommandé de 1 heure
                subdivisionCount = 4; // 4 subdivisions de 15 minutes
            } else if (step === 2) {
                subdivisionCount = 8; // 8 subdivisions de 15 minutes
            } else if (step === 3) {
                subdivisionCount = 12; // 12 subdivisions de 15 minutes
            } else if (step === 6) {
                subdivisionCount = 24; // 24 subdivisions de 15 minutes
            } else if (step === 12) {
                subdivisionCount = 48; // 48 subdivisions de 15 minutes
            } else if (step === 0.5) {
                subdivisionCount = 2; // 2 subdivisions de 15 minutes
            } else if (step === 0.25) {
                subdivisionCount = 1; // Pas de subdivision pour 15 minutes
            } else {
                // Pour les autres pas
                subdivisionCount = Math.ceil(step * 4); // 4 subdivisions par heure
            }
            break;

        case "day":
            // Pour les jours: subdivisions de 6 heures (quarts de jour)
            if (step === 1) {
                // Pas recommandé de 1 jour
                subdivisionCount = 4; // 4 subdivisions de 6 heures
            } else if (step === 7) {
                // Pour une semaine
                subdivisionCount = 28; // 28 subdivisions de 6 heures
            } else if (step === 0.5) {
                subdivisionCount = 2; // 2 subdivisions de 6 heures
            } else {
                // Pour les autres pas
                subdivisionCount = Math.ceil(step * 4); // 4 subdivisions par jour
            }
            break;

        default:
            // Valeur par défaut
            subdivisionCount = 5;
    }

    // Si le nombre de graduations principales est très élevé, réduire les subdivisions
    const mainGraduationsCount = Math.floor(range / step) + 1;
    if (mainGraduationsCount > 20 && subdivisionCount > 2) {
        subdivisionCount = 2; // Utiliser seulement 2 subdivisions pour éviter la surcharge
    }

    // Calculer le pas des subdivisions
    subdivisionStep = step / subdivisionCount;

    return {
        subdivisions: subdivisionCount,
        subdivisionStep,
    };
};

/**
 * Génère les valeurs des sous-graduations entre deux graduations principales
 * @param {number} start - Valeur de début
 * @param {number} end - Valeur de fin
 * @param {Object} subdivInfo - Informations sur les subdivisions
 * @returns {Array} - Tableau des valeurs des sous-graduations
 */
export const generateSubdivisionValues = (start, end, subdivInfo) => {
    const { subdivisionStep } = subdivInfo;
    const values = [];

    // Générer toutes les sous-graduations
    for (let i = start + subdivisionStep; i < end; i += subdivisionStep) {
        // Arrondir pour éviter les erreurs de précision
        values.push(Math.round(i * 1000) / 1000);
    }

    return values;
};
