// src/hooks/useGraduationInteractions.js
import { useState, useCallback } from "react";

export const useGraduationInteractions = (settings, getValueFromPosition) => {
    const [values, setValues] = useState(new Set());
    const [hiddenMainValues, setHiddenMainValues] = useState(new Set());
    const [arrows, setArrows] = useState(new Set());

    const handleClick = useCallback(
        (event, width, isAbove) => {
            const [start, end] = settings.intervals;
            const clickedValue = getValueFromPosition(
                event.clientX,
                width,
                start,
                end
            );

            if (clickedValue >= start && clickedValue <= end) {
                if (isAbove) {
                    // Clic au-dessus : gestion des valeurs
                    const subdivisions =
                        settings.notation === "decimal"
                            ? 10
                            : settings.denominator;
                    const isMainGraduation =
                        Math.abs((clickedValue * subdivisions) % subdivisions) <
                        0.1;

                    if (isMainGraduation) {
                        setHiddenMainValues((prev) => {
                            const newHidden = new Set(prev);
                            newHidden.has(clickedValue)
                                ? newHidden.delete(clickedValue)
                                : newHidden.add(clickedValue);
                            return newHidden;
                        });
                    } else {
                        setValues((prev) => {
                            const newValues = new Set(prev);
                            newValues.has(clickedValue)
                                ? newValues.delete(clickedValue)
                                : newValues.add(clickedValue);
                            return newValues;
                        });
                    }
                } else {
                    // Clic en-dessous : gestion des flèches
                    setArrows((prev) => {
                        const newArrows = new Set(prev);
                        newArrows.has(clickedValue)
                            ? newArrows.delete(clickedValue)
                            : newArrows.add(clickedValue);
                        return newArrows;
                    });
                }
            }
        },
        [
            settings.intervals,
            settings.notation,
            settings.denominator,
            getValueFromPosition,
        ]
    );

    return { values, hiddenMainValues, arrows, handleClick };
};
