// common/hooks/useGraduationInteractions.js
import { useState, useCallback } from "react";

/**
 * Détermine si une valeur correspond à une graduation principale
 * @param {number} value - Valeur à tester
 * @param {number} subdivisions - Nombre de subdivisions entre deux graduations principales
 * @returns {boolean} True si c'est une graduation principale
 */
const isMainValue = (value, subdivisions) => {
    return Math.abs((value * subdivisions) % subdivisions) < 0.1;
};

/**
 * Hook gérant les interactions avec la ligne graduée
 * @param {Object} settings - Paramètres de configuration de la ligne
 * @param {Function} getValueFromPosition - Fonction de conversion position → valeur
 * @param {Object} externalState - État externe (optionnel)
 * @returns {Object} États et fonctions de gestion des interactions
 */
export const useGraduationInteractions = (
    settings,
    getValueFromPosition,
    externalState = null
) => {
    // Utilise l'état externe s'il est fourni, sinon crée un état local
    const [localValues, setLocalValues] = useState(new Set());
    const [localHiddenMainValues, setLocalHiddenMainValues] = useState(
        new Set()
    );
    const [localArrows, setLocalArrows] = useState(new Set());

    // Utilise soit l'état externe soit l'état local
    const values = externalState?.values || localValues;
    const hiddenMainValues =
        externalState?.hiddenMainValues || localHiddenMainValues;
    const arrows = externalState?.arrows || localArrows;

    const setValues = externalState?.setValues || setLocalValues;
    const setHiddenMainValues =
        externalState?.setHiddenMainValues || setLocalHiddenMainValues;
    const setArrows = externalState?.setArrows || setLocalArrows;

    /**
     * Gère les clics sur la ligne graduée
     */
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
                    const subdivisions =
                        settings.notation === "decimal"
                            ? 10
                            : settings.denominator;

                    if (isMainValue(clickedValue, subdivisions)) {
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
            setValues,
            setHiddenMainValues,
            setArrows,
        ]
    );

    const hideAllMainValues = useCallback(() => {
        const [start, end] = settings.intervals;
        const subdivisions =
            settings.notation === "decimal" ? 10 : settings.denominator;
        const mainValues = new Set();

        for (let i = start; i <= end; i += settings.step) {
            if (isMainValue(i, subdivisions)) {
                mainValues.add(i);
            }
        }
        setHiddenMainValues(mainValues);
    }, [settings, setHiddenMainValues]);

    const showAllMainValues = useCallback(() => {
        setHiddenMainValues(new Set());
    }, [setHiddenMainValues]);

    const resetDisplay = useCallback(() => {
        setValues(new Set());
        setHiddenMainValues(new Set());
        setArrows(new Set());
    }, [setValues, setHiddenMainValues, setArrows]);

    return {
        values,
        hiddenMainValues,
        arrows,
        handleClick,
        hideAllMainValues,
        showAllMainValues,
        resetDisplay,
    };
};
