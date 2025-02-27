import { memo, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useGraduationCalculator } from "@common/hooks";
import { useGraduationInteractionsTime } from "../hooks/useGraduationInteractionsTime";
import { drawTopArrow, drawBottomArrow } from "@common/utils/drawing";
import {
    formatTimeOnGraduation,
    getTimeSubdivisions,
} from "../utils/timeFormatter";

/**
 * Composant affichant une ligne graduée adaptée aux mesures de temps
 * @param {Object} props Les propriétés du composant
 * @param {Object} props.settings Configuration de la ligne graduée temporelle
 * @param {Set} [props.values] Valeurs à afficher (optionnel)
 * @param {Set} [props.hiddenMainValues] Graduations principales masquées (optionnel)
 * @param {Set} [props.arrows] Flèches à afficher (optionnel)
 * @param {Function} [props.onStateChange] Callback appelé lors des changements d'état
 * @returns {JSX.Element} Le composant TimeGraduatedLine
 */
const TimeGraduatedLine = memo(
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
            useGraduationInteractionsTime(
                settings,
                getValueFromPosition,
                externalState
            );

        // Dessin des graduations temporelles
        const drawTimeGraduations = useCallback(
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
                        formatTimeOnGraduation(
                            value,
                            settings,
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

                    // Graduations secondaires adaptées aux mesures de temps
                    const subdivisions = getTimeSubdivisions(settings);
                    if (subdivisions > 1) {
                        for (let j = 1; j < subdivisions; j++) {
                            // Adapter le calcul pour tenir compte des unités de temps
                            const subValue = i + (j * step) / subdivisions;
                            if (subValue < end) {
                                const subX = Math.floor(
                                    50 + (subValue - start) * pixelsPerUnit
                                );
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
            [settings, values, hiddenMainValues, arrows]
        );

        // Effet pour le rendu initial et les mises à jour
        useEffect(() => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const [start, end] = settings.intervals;

            requestAnimationFrame(() => {
                drawTimeGraduations(
                    ctx,
                    start,
                    end,
                    settings.step,
                    canvas.height / 2
                );
            });
        }, [settings, drawTimeGraduations]);

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

        const timeUnitDescription =
            settings.timeUnit === "second"
                ? "secondes"
                : settings.timeUnit === "minute"
                ? "minutes"
                : settings.timeUnit === "hour"
                ? "heures"
                : "jours";

        return (
            <div
                className="bg-white p-4 rounded-lg shadow"
                role="figure"
                aria-label="Ligne graduée temporelle interactive"
            >
                <canvas
                    role="img"
                    aria-description={`Ligne graduée temporelle de ${settings.intervals[0]} à ${settings.intervals[1]} ${timeUnitDescription}. Cliquez au-dessus de la ligne pour afficher ou masquer une valeur. Cliquez en-dessous pour placer une flèche rouge.`}
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

TimeGraduatedLine.propTypes = {
    settings: PropTypes.shape({
        notation: PropTypes.string.isRequired,
        intervals: PropTypes.arrayOf(PropTypes.number).isRequired,
        denominator: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        timeUnit: PropTypes.string.isRequired,
        displayFormat: PropTypes.string.isRequired,
    }).isRequired,
    values: PropTypes.instanceOf(Set),
    hiddenMainValues: PropTypes.instanceOf(Set),
    arrows: PropTypes.instanceOf(Set),
    onStateChange: PropTypes.func,
};

TimeGraduatedLine.displayName = "TimeGraduatedLine";

export default TimeGraduatedLine;
