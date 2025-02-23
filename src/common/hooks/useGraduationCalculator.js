// src/hooks/useGraduationCalculator.js
import { useCallback } from "react";

export const useGraduationCalculator = (settings, canvasRef) => {
    const getValueFromPosition = useCallback(
        (clientX, width, start, end) => {
            const canvas = canvasRef.current;
            const boundingRect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / boundingRect.width;

            const x = (clientX - boundingRect.left) * scaleX;
            const pixelsPerUnit = width / (end - start);
            const rawValue = (x - 50) / pixelsPerUnit + start;

            // Gestion spécifique pour chaque notation
            if (settings.notation === "decimal") {
                // Arrondir à 0.1 près pour la notation décimale
                return Math.round(rawValue * 10) / 10;
            }
            return (
                Math.round(rawValue * settings.denominator) /
                settings.denominator
            );
        },
        [canvasRef, settings.notation, settings.denominator]
    );

    return { getValueFromPosition };
};
