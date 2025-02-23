// src/utils/drawingUtils.js
/**
 * Dessine une flèche vers le bas pour les valeurs
 * @param {CanvasRenderingContext2D} ctx Contexte du canvas
 * @param {number} x Position horizontale
 * @param {number} height Hauteur de référence
 */
export const drawTopArrow = (ctx, x, height) => {
    ctx.beginPath();
    ctx.moveTo(x, height - 35);
    ctx.lineTo(x, height - 20);
    ctx.lineTo(x - 5, height - 25);
    ctx.moveTo(x, height - 20);
    ctx.lineTo(x + 5, height - 25);
    ctx.lineWidth = 1;
    ctx.stroke();
};

/**
 * Dessine une flèche vers le haut pour les marqueurs
 * @param {CanvasRenderingContext2D} ctx Contexte du canvas
 * @param {number} x Position horizontale
 * @param {number} height Hauteur de référence
 */
export const drawBottomArrow = (ctx, x, height) => {
    ctx.beginPath();
    ctx.moveTo(x, height + 35);
    ctx.lineTo(x, height + 20);
    ctx.lineTo(x - 5, height + 25);
    ctx.moveTo(x, height + 20);
    ctx.lineTo(x + 5, height + 25);
    ctx.lineWidth = 1;
    ctx.stroke();
};

/**
 * Dessine une fraction avec barre horizontale
 * @param {CanvasRenderingContext2D} ctx Contexte du canvas
 * @param {number} x Position horizontale
 * @param {number} y Position verticale
 * @param {string} numerator Numérateur
 * @param {string} denominator Dénominateur
 */
// src/utils/drawingUtils.js
export const drawFraction = (ctx, x, y, numerator, denominator) => {
    const fontSize = 14;
    ctx.font = `${fontSize}px Roboto`;

    // Mesure des dimensions
    const numWidth = ctx.measureText(numerator).width;
    const denomWidth = ctx.measureText(denominator).width;
    const maxWidth = 2 * Math.max(numWidth, denomWidth);

    // Positions ajustées (fraction entière remontée)
    const numY = y - 20;
    const lineY = y - 7; // La barre sera le point de référence
    const denomY = y - 5; // Dénominateur remonté

    // Dessin du numérateur
    ctx.fillText(numerator, x, numY);

    // Dessin de la barre horizontale
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(x - maxWidth / 2, lineY);
    ctx.lineTo(x + maxWidth / 2, lineY);
    ctx.stroke();

    // Dessin du dénominateur
    ctx.fillText(denominator, x, denomY);
};
