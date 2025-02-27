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

    // Tableau des subdivisions naturelles pour chaque unité
    const naturalSubdivisions = {
        second: [2, 5, 10, 15, 20, 30],
        minute: [2, 4, 5, 6, 10, 12, 15, 20, 30],
        hour: [2, 3, 4, 6, 12, 15, 20, 30],
        day: [2, 3, 4, 6, 8, 12],
    };

    // Déterminer le nombre optimal de subdivisions
    const mainGraduationsCount = Math.floor(range / step) + 1;

    // Si nous avons trop de graduations principales, réduire les subdivisions
    if (mainGraduationsCount > 20) {
        return {
            subdivisions: 2, // Subdivision minimale pour ne pas surcharger
            subdivisionStep: step / 2,
        };
    }

    // Si nous avons très peu de graduations principales, augmenter les subdivisions
    if (mainGraduationsCount <= 5) {
        // Choisir une subdivision naturelle adaptée
        const divisions = naturalSubdivisions[timeUnit];
        // Trouver une subdivision qui divise bien le pas
        for (const div of divisions) {
            if (step % div === 0 || div % step === 0) {
                return {
                    subdivisions: step / div,
                    subdivisionStep: div,
                };
            }
        }

        // Si aucune ne convient, choisir une valeur qui donne un résultat propre
        const subDiv =
            timeUnit === "second" || timeUnit === "minute"
                ? 5
                : timeUnit === "hour"
                ? 15
                : 6;

        return {
            subdivisions: Math.max(5, Math.floor(step / subDiv)),
            subdivisionStep: subDiv,
        };
    }

    // Cas standard: équilibrer entre lisibilité et précision
    let subdivisionCount;

    // Adapter en fonction de l'unité et du pas
    switch (timeUnit) {
        case "second":
            if (step >= 30) subdivisionCount = 6;
            else if (step >= 15) subdivisionCount = 5;
            else if (step >= 5) subdivisionCount = 5;
            else subdivisionCount = 2; // Pour les petits pas
            break;
        case "minute":
            if (step >= 30) subdivisionCount = 6;
            else if (step >= 15) subdivisionCount = 3;
            else if (step >= 5) subdivisionCount = 5;
            else subdivisionCount = 2;
            break;
        case "hour":
            if (step >= 6) subdivisionCount = 6;
            else if (step >= 1) subdivisionCount = 4;
            else subdivisionCount = 2;
            break;
        case "day":
            if (step >= 7) subdivisionCount = 7; // Semaine
            else if (step >= 1) subdivisionCount = 4; // Jours en quarts
            else subdivisionCount = 2;
            break;
        default:
            subdivisionCount = 5;
    }

    // Ajuster les subdivisions pour les pas non-standards
    if (step % 1 !== 0) {
        // Pour les pas fractionnaires (0.5h, 0.25j, etc.)
        subdivisionCount = Math.ceil(1 / step);
    }

    // Calculer les subdivisions et leur pas
    return {
        subdivisions: subdivisionCount,
        subdivisionStep: step / subdivisionCount,
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
