// common/components/GraduatedLine/index.jsx
import { memo, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
    useGraduationCalculator,
    useGraduationInteractions,
} from "@common/hooks";
import {
    drawTopArrow,
    drawBottomArrow,
    drawFraction,
} from "@common/utils/drawing";
import { numberToFraction } from "@common/utils/math";

/**
 * Composant affichant une ligne graduée interactive
 * @param {Object} props Les propriétés du composant
 * @param {Object} props.settings Configuration de la ligne graduée
 * @param {Set} [props.values] Valeurs à afficher (optionnel)
 * @param {Set} [props.hiddenMainValues] Graduations principales masquées (optionnel)
 * @param {Set} [props.arrows] Flèches à afficher (optionnel)
 * @param {Function} [props.onStateChange] Callback appelé lors des changements d'état
 * @returns {JSX.Element} Le composant GraduatedLine
 */
const GraduatedLine = memo(
    ({
        settings,
        values: externalValues,
        hiddenMainValues: externalHiddenMainValues,
        arrows: externalArrows,
        onStateChange,
    }) => {
        const canvasRef = useRef(null);

        // Hooks personnalisés
        const { getValueFromPosition } = useGraduationCalculator(
            settings,
            canvasRef
        );

        // Configure l'état externe si fourni
        const externalState =
            externalValues && externalHiddenMainValues && externalArrows
                ? {
                      values: externalValues,
                      hiddenMainValues: externalHiddenMainValues,
                      arrows: externalArrows,
                      setValues: (newValues) =>
                          onStateChange?.("values", newValues),
                      setHiddenMainValues: (newHidden) =>
                          onStateChange?.("hiddenMainValues", newHidden),
                      setArrows: (newArrows) =>
                          onStateChange?.("arrows", newArrows),
                  }
                : null;

        const { values, hiddenMainValues, arrows, handleClick } =
            useGraduationInteractions(
                settings,
                getValueFromPosition,
                externalState
            );

        // Formatage des nombres
        const formatNumber = useCallback(
            (value, notation, ctx, x, y) => {
                ctx.textAlign = "center";
                ctx.textBaseline = "top";

                switch (notation) {
                    case "decimal":
                        ctx.fillText(
                            Number.isInteger(value)
                                ? value.toString()
                                : value.toFixed(1),
                            x,
                            y
                        );
                        break;
                    case "fraction": {
                        const { numerator, denominator } = numberToFraction(
                            value,
                            settings.denominator
                        );
                        if (denominator === 1) {
                            ctx.fillText(numerator.toString(), x, y);
                        } else {
                            drawFraction(
                                ctx,
                                x,
                                y,
                                numerator.toString(),
                                denominator.toString()
                            );
                        }
                        break;
                    }
                    case "mixedNumber": {
                        const wholePart = Math.floor(value);
                        const fractionalPart = value - wholePart;

                        if (fractionalPart === 0) {
                            ctx.fillText(wholePart.toString(), x, y);
                        } else {
                            const { numerator, denominator } = numberToFraction(
                                fractionalPart,
                                settings.denominator
                            );
                            if (wholePart === 0) {
                                drawFraction(
                                    ctx,
                                    x,
                                    y,
                                    numerator.toString(),
                                    denominator.toString()
                                );
                            } else {
                                // Alignement du nombre entier avec la barre de fraction
                                ctx.fillText(
                                    wholePart.toString(),
                                    x - 13,
                                    y - 13
                                );
                                ctx.fillText("+", x, y - 13); // Le + est aligné avec la barre
                                drawFraction(
                                    ctx,
                                    x + 15,
                                    y,
                                    numerator.toString(),
                                    denominator.toString()
                                );
                            }
                        }
                        break;
                    }
                    default:
                        ctx.fillText(value.toString(), x, y);
                }
            },
            [settings.denominator]
        );

        // Dessin des graduations
        const drawGraduations = useCallback(
            (ctx, start, end, step, height) => {
                // Configuration initiale du canvas
                ctx.strokeStyle = "#000000";
                ctx.fillStyle = "#000000";
                ctx.font = "14px Arial";

                // Effacement et ligne principale
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.fillStyle = "#000000";

                const width = ctx.canvas.width - 100;
                ctx.beginPath();
                ctx.moveTo(50, height);
                ctx.lineTo(width + 50, height);
                ctx.lineWidth = 2;
                ctx.stroke();

                const pixelsPerUnit = width / (end - start);

                // Fonction locale pour dessiner une graduation
                const drawGraduation = (x, value, isMain) => {
                    // Graduation
                    ctx.beginPath();
                    ctx.moveTo(x, height - (isMain ? 15 : 8));
                    ctx.lineTo(x, height + (isMain ? 15 : 8));
                    ctx.lineWidth = isMain ? 1 : 0.5;
                    ctx.stroke();

                    // Valeur et flèche du haut
                    if (
                        (isMain && !hiddenMainValues.has(value)) ||
                        values.has(value)
                    ) {
                        formatNumber(
                            value,
                            settings.notation,
                            ctx,
                            x,
                            height - 50
                        );
                        drawTopArrow(ctx, x, isMain ? height : height + 8);
                    }

                    // Flèche du bas
                    if (arrows.has(value)) {
                        ctx.strokeStyle = "#FF0000";
                        drawBottomArrow(ctx, x, isMain ? height : height - 8);
                        ctx.strokeStyle = "#000000";
                    }
                };

                // Dessin des graduations principales et secondaires
                for (let i = start; i < end; i += step) {
                    const x = Math.floor(50 + (i - start) * pixelsPerUnit);
                    drawGraduation(x, i, true);

                    // Graduations secondaires
                    const subdivisions =
                        settings.notation === "decimal"
                            ? 10
                            : settings.denominator;
                    if (subdivisions > 1) {
                        for (let j = 1; j < subdivisions; j++) {
                            const subX = Math.floor(
                                x + (j * pixelsPerUnit) / subdivisions
                            );
                            if (subX < x + pixelsPerUnit) {
                                const subValue = i + j / subdivisions;
                                drawGraduation(subX, subValue, false);
                            }
                        }
                    }
                }

                // Dernière graduation
                drawGraduation(
                    Math.floor(50 + (end - start) * pixelsPerUnit),
                    end,
                    true
                );
            },
            [
                settings.notation,
                settings.denominator,
                formatNumber,
                values,
                hiddenMainValues,
                arrows,
            ]
        );

        // Effet pour le rendu initial et les mises à jour
        useEffect(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const [start, end] = settings.intervals;

            requestAnimationFrame(() => {
                drawGraduations(
                    ctx,
                    start,
                    end,
                    settings.step,
                    canvas.height / 2
                );
            });
        }, [settings, drawGraduations]);

        // Gestionnaire de clic
        const handleCanvasClick = useCallback(
            (event) => {
                const canvas = canvasRef.current;
                const rect = canvas.getBoundingClientRect();
                const width = canvas.width - 100;
                const height = canvas.height / 2;
                // Détermine si le clic est au-dessus ou en-dessous de la ligne
                const isAbove =
                    (event.clientY - rect.top) * (canvas.height / rect.height) <
                    height;

                handleClick(event, width, isAbove);
            },
            [handleClick]
        );

        return (
            <div
                className="bg-white p-4 rounded-lg shadow"
                role="figure"
                aria-label="Ligne graduée interactive"
            >
                <canvas
                    role="img"
                    aria-description={`Ligne graduée de ${settings.intervals[0]} à ${settings.intervals[1]}. Cliquer au-dessus de la ligne pour afficher ou masquer une valeur. Cliquer en-dessous pour placer une flèche rouge.`}
                    ref={canvasRef}
                    width={800}
                    height={200}
                    className="w-full cursor-pointer focus:outline-blue-500"
                    onClick={handleCanvasClick}
                    tabIndex={0}
                />
            </div>
        );
    }
);

GraduatedLine.propTypes = {
    settings: PropTypes.shape({
        notation: PropTypes.oneOf(["decimal", "fraction", "mixedNumber"])
            .isRequired,
        intervals: PropTypes.arrayOf(PropTypes.number).isRequired,
        denominator: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
    }).isRequired,
    values: PropTypes.instanceOf(Set),
    hiddenMainValues: PropTypes.instanceOf(Set),
    arrows: PropTypes.instanceOf(Set),
    onStateChange: PropTypes.func,
};

GraduatedLine.displayName = "GraduatedLine";

export default GraduatedLine;
