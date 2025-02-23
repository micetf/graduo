// src/utils/mathUtils.js
/**
 * Calcule le PGCD de deux nombres
 * @param {number} a Premier nombre
 * @param {number} b Second nombre
 * @returns {number} PGCD des deux nombres
 */
export const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        const t = b;
        b = a % b;
        a = t;
    }
    return a;
};

/**
 * Convertit un nombre en fraction avec un dénominateur spécifique
 * @param {number} value Nombre à convertir
 * @param {number} denominator Dénominateur souhaité
 * @returns {Object} Objet contenant le numérateur et le dénominateur
 */
export const numberToFraction = (value, denominator = 2) => {
    // Si le nombre est entier, on retourne juste le numérateur
    if (Number.isInteger(value)) {
        return {
            numerator: value,
            denominator: 1,
        };
    }

    // Sinon on utilise le dénominateur choisi
    const numerator = Math.round(value * denominator);
    return {
        numerator,
        denominator,
    };
};
