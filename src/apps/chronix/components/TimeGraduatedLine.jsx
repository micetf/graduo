import { memo, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useGraduationCalculator } from "@common/hooks";
import { useGraduationInteractionsTime } from "../hooks/useGraduationInteractionsTime";
import { drawTopArrow, drawBottomArrow } from "@common/utils/drawing";
import { formatTimeOnGraduation } from "../utils/timeFormatter";
import {
    calculateOptimalTimeSubdivisions,
    generateSubdivisionValues,
} from "../utils/adaptiveSubdivisions";

/**
 * Composant affichant une ligne graduée adaptée aux mesures de temps
 * avec des sous-graduations intelligentes
 * @param {Object} props Les propriétés du composant
 * @param {Object} props.settings Configuration de la ligne graduée temporelle
 * @param {Set} [props.values] Valeurs sélectionnées (optionnel)
 * @param {Set} [props.hiddenMainValues] Graduations principales masquées (optionnel)
 * @param {Set} [props.hiddenSubValues] Sous-graduations affichées (optionnel)
 * @param {Set} [props.arrows] Flèches à afficher (optionnel)
 * @param {Function} [props.onStateChange] Callback appelé lors des changements d'état
 * @param {string} [props.selectionMode] Mode de sélection ("normal" ou "selection")
 * @returns {JSX.Element} Le composant TimeGraduatedLine
 */
const TimeGraduatedLine = memo(
    ({
        settings,
        values: externalValues,
        hiddenMainValues: externalHiddenMainValues,
        hiddenSubValues: externalHiddenSubValues,
        arrows: externalArrows,
        onStateChange,
        selectionMode = "normal",
    }) => {
        const canvasRef = useRef(null);

        // Hooks personnalisés
        const { getValueFromPosition } = useGraduationCalculator(
            settings,
            canvasRef
        );

        // Configure l'état externe si fourni
        const externalState =
            externalValues &&
            externalHiddenMainValues &&
            externalHiddenSubValues &&
            externalArrows
                ? {
                      values: externalValues,
                      hiddenMainValues: externalHiddenMainValues,
                      hiddenSubValues: externalHiddenSubValues,
                      arrows: externalArrows,
                      setValues: (newValues) =>
                          onStateChange?.("values", newValues),
                      setHiddenMainValues: (newHidden) =>
                          onStateChange?.("hiddenMainValues", newHidden),
                      setHiddenSubValues: (newHidden) =>
                          onStateChange?.("hiddenSubValues", newHidden),
                      setArrows: (newArrows) =>
                          onStateChange?.("arrows", newArrows),
                  }
                : null;

        const {
            values,
            hiddenMainValues,
            hiddenSubValues,
            arrows,
            handleClick,
        } = useGraduationInteractionsTime(
            settings,
            getValueFromPosition,
            externalState,
            selectionMode
        );

        // Dessin des graduations temporelles avec subdivisions adaptatives
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

                // Calculer les subdivisions optimales
                const subdivInfo = calculateOptimalTimeSubdivisions(settings);

                // Fonction locale pour dessiner une graduation
                const drawGraduation = (x, value, isMain) => {
                    // Vérifier si cette valeur est sélectionnée pour comparaison
                    const isSelected = values.has(value);

                    // Graduations principales: affichées sauf si dans hiddenMainValues
                    // Sous-graduations: affichées seulement si dans hiddenSubValues
                    const shouldDisplay = isMain
                        ? !hiddenMainValues.has(value)
                        : hiddenSubValues.has(value);

                    // Hauteur variable des graduations selon leur importance
                    const gradHeight = isMain
                        ? 15
                        : (value * 10) % 10 === 5 ||
                          (settings.timeUnit === "hour" &&
                              (value * 60) % 60 === 30) ||
                          (settings.timeUnit === "day" &&
                              (value * 24) % 24 === 12)
                        ? 12
                        : 8;

                    // Ajuster l'épaisseur du trait selon l'importance
                    const lineWidth = isMain
                        ? 1.5
                        : (value * 10) % 10 === 5 ||
                          (settings.timeUnit === "hour" &&
                              (value * 60) % 60 === 30) ||
                          (settings.timeUnit === "day" &&
                              (value * 24) % 24 === 12)
                        ? 1
                        : 0.5;

                    // Graduation (toujours visible)
                    ctx.beginPath();
                    ctx.moveTo(x, height - gradHeight);
                    ctx.lineTo(x, height + gradHeight);
                    ctx.lineWidth = lineWidth;
                    ctx.stroke();

                    // Si c'est une valeur sélectionnée ET en mode sélection, on dessine un point rouge
                    if (isSelected && selectionMode === "selection") {
                        ctx.beginPath();
                        ctx.arc(x, height, 6, 0, 2 * Math.PI);
                        ctx.fillStyle = "#FF4136"; // Rouge vif
                        ctx.fill();
                        ctx.lineWidth = 1;
                        ctx.strokeStyle = "#85144b"; // Bordure plus foncée
                        ctx.stroke();

                        // Restaurer les couleurs
                        ctx.fillStyle = "#000000";
                        ctx.strokeStyle = "#000000";
                    }

                    // Valeur et flèche du haut (affichées selon shouldDisplay ou si sélectionnée en mode sélection)
                    if (
                        shouldDisplay ||
                        (selectionMode === "selection" && isSelected)
                    ) {
                        formatTimeOnGraduation(
                            value,
                            settings,
                            ctx,
                            x,
                            height - 50
                        );

                        // Dessiner la flèche en fonction de l'état (sélection/mode)
                        if (isSelected && selectionMode === "selection") {
                            ctx.strokeStyle = "#FF4136"; // Flèche rouge vif en mode sélection
                        }
                        drawTopArrow(ctx, x, isMain ? height : height + 8);
                        ctx.strokeStyle = "#000000"; // Restaurer la couleur
                    }

                    // Flèche du bas (si présente)
                    if (arrows.has(value)) {
                        ctx.strokeStyle = "#FF0000";
                        drawBottomArrow(ctx, x, isMain ? height : height - 8);
                        ctx.strokeStyle = "#000000";
                    }
                };

                // Dessin des graduations principales
                for (let i = start; i <= end; i += step) {
                    const x = Math.floor(50 + (i - start) * pixelsPerUnit);

                    // Dessiner la graduation principale
                    drawGraduation(x, i, true);

                    // Si nous ne sommes pas à la dernière graduation
                    if (i + step <= end) {
                        // Générer les sous-graduations entre deux graduations principales
                        const subdivValues = generateSubdivisionValues(
                            i,
                            i + step,
                            subdivInfo
                        );

                        // Dessiner les sous-graduations
                        for (const subValue of subdivValues) {
                            const subX = Math.floor(
                                50 + (subValue - start) * pixelsPerUnit
                            );
                            drawGraduation(subX, subValue, false);
                        }
                    }
                }
            },
            [
                settings,
                values,
                hiddenMainValues,
                hiddenSubValues,
                arrows,
                selectionMode,
            ]
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

        // Obtenir une description pédagogique de l'unité de temps
        const getTimeUnitDescription = (unit) => {
            switch (unit) {
                case "second":
                    return "secondes avec subdivisions de 1 seconde";
                case "minute":
                    return "minutes avec subdivisions de 1 minute";
                case "hour":
                    return "heures avec subdivisions de 15 minutes (quarts d'heure)";
                case "day":
                    return "jours avec subdivisions de 6 heures (quarts de journée)";
                default:
                    return unit;
            }
        };

        const timeUnitDescription = getTimeUnitDescription(settings.timeUnit);

        return (
            <div
                className={`bg-white p-4 rounded-lg shadow ${
                    selectionMode === "selection"
                        ? "border-2 border-indigo-300"
                        : ""
                }`}
                role="figure"
                aria-label="Ligne graduée temporelle interactive"
            >
                {/* Indicateur des subdivisions pour les enseignants */}
                <div className="mb-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600 italic">
                        Unité: {timeUnitDescription}
                    </span>
                    {selectionMode === "selection" && (
                        <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">
                            Mode sélection actif
                        </span>
                    )}
                </div>

                <canvas
                    role="img"
                    aria-description={`Ligne graduée temporelle de ${
                        settings.intervals[0]
                    } à ${settings.intervals[1]} ${timeUnitDescription}. ${
                        selectionMode === "selection"
                            ? "Cliquez sur les graduations pour sélectionner des valeurs à comparer."
                            : "Cliquez au-dessus de la ligne pour afficher ou masquer une valeur. Cliquez en-dessous pour placer une flèche rouge."
                    }`}
                    ref={canvasRef}
                    width={800}
                    height={200}
                    className={`w-full cursor-pointer focus:outline-blue-500 ${
                        selectionMode === "selection" ? "hover:cursor-cell" : ""
                    }`}
                    onClick={handleCanvasClick}
                    tabIndex={0}
                />

                {/* Instructions adaptées au mode actif */}
                <div className="mt-2 text-sm text-gray-600">
                    {selectionMode === "selection" ? (
                        <p>
                            <span className="font-medium text-indigo-700">
                                Mode sélection :
                            </span>{" "}
                            Cliquez sur n&lsquo;importe quelle valeur pour la
                            sélectionner ou la désélectionner.
                        </p>
                    ) : (
                        <p>
                            <span className="font-medium">
                                Mode affichage :
                            </span>{" "}
                            Cliquez sur n&lsquo;importe quelle graduation pour
                            l&lsquo;afficher ou la masquer.
                        </p>
                    )}
                </div>
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
    hiddenSubValues: PropTypes.instanceOf(Set),
    arrows: PropTypes.instanceOf(Set),
    onStateChange: PropTypes.func,
    selectionMode: PropTypes.string,
};

TimeGraduatedLine.displayName = "TimeGraduatedLine";

export default TimeGraduatedLine;
