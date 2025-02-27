import { useState, useCallback } from "react";
import { snapToTimeGraduation } from "../utils/timeUtils";
import { isMainTimeValue } from "../utils/timeFormatter";

/**
 * Hook gérant les interactions avec la ligne graduée temporelle
 * @param {Object} settings - Paramètres de configuration de la ligne
 * @param {Function} getValueFromPosition - Fonction de conversion position → valeur
 * @param {Object} externalState - État externe (optionnel)
 * @returns {Object} États et fonctions de gestion des interactions
 */
export const useGraduationInteractionsTime = (
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
    // Nouvel état pour le mode de sélection
    const [selectionMode, setSelectionMode] = useState("normal"); // "normal" ou "comparison"

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
     * Gère les clics sur la ligne graduée temporelle
     */
    const handleClick = useCallback(
        (event, width, isAbove) => {
            const [start, end] = settings.intervals;
            // Obtenir la valeur exacte à partir de la position du clic
            let clickedValue = getValueFromPosition(
                event.clientX,
                width,
                start,
                end
            );

            // Arrondir la valeur à la graduation la plus proche
            clickedValue = snapToTimeGraduation(clickedValue, settings);

            // Vérifier que la valeur arrondie est dans les limites
            if (clickedValue >= start && clickedValue <= end) {
                if (isAbove) {
                    // Déterminer si c'est une graduation principale
                    const isMainValue = isMainTimeValue(clickedValue, settings);

                    // Mode comparaison: toutes les valeurs sont ajoutées à values
                    if (selectionMode === "comparison") {
                        // Si c'est une graduation principale et qu'elle est masquée,
                        // on doit d'abord la rendre visible
                        if (isMainValue && hiddenMainValues.has(clickedValue)) {
                            setHiddenMainValues((prev) => {
                                const newHidden = new Set(prev);
                                newHidden.delete(clickedValue);
                                return newHidden;
                            });
                        }

                        // Ensuite, on l'ajoute/supprime des valeurs sélectionnées
                        setValues((prev) => {
                            const newValues = new Set(prev);
                            newValues.has(clickedValue)
                                ? newValues.delete(clickedValue)
                                : newValues.add(clickedValue);
                            return newValues;
                        });
                    }
                    // Mode normal: comportement standard
                    else {
                        if (isMainValue) {
                            // Si c'est une graduation principale, on la masque/affiche
                            setHiddenMainValues((prev) => {
                                const newHidden = new Set(prev);
                                newHidden.has(clickedValue)
                                    ? newHidden.delete(clickedValue)
                                    : newHidden.add(clickedValue);
                                return newHidden;
                            });
                        } else {
                            // Si c'est une sous-graduation, on l'ajoute/supprime des valeurs
                            setValues((prev) => {
                                const newValues = new Set(prev);
                                newValues.has(clickedValue)
                                    ? newValues.delete(clickedValue)
                                    : newValues.add(clickedValue);
                                return newValues;
                            });
                        }
                    }
                } else {
                    // Pour les clics en-dessous de la ligne (flèches), comportement inchangé
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
            settings,
            getValueFromPosition,
            selectionMode,
            hiddenMainValues,
            setValues,
            setHiddenMainValues,
            setArrows,
        ]
    );

    /**
     * Basculer entre le mode normal et le mode comparaison
     */
    const toggleSelectionMode = useCallback(() => {
        setSelectionMode((prev) =>
            prev === "normal" ? "comparison" : "normal"
        );
    }, []);

    /**
     * Masque toutes les graduations principales
     */
    const hideAllMainValues = useCallback(() => {
        const [start, end] = settings.intervals;
        const mainValues = new Set();

        // Parcourir toutes les graduations principales
        for (let i = start; i <= end; i += settings.step) {
            if (isMainTimeValue(i, settings)) {
                mainValues.add(i);
            }
        }
        setHiddenMainValues(mainValues);
    }, [settings, setHiddenMainValues]);

    /**
     * Affiche toutes les graduations principales
     */
    const showAllMainValues = useCallback(() => {
        setHiddenMainValues(new Set());
    }, [setHiddenMainValues]);

    /**
     * Réinitialise l'affichage
     */
    const resetDisplay = useCallback(() => {
        setValues(new Set());
        setHiddenMainValues(new Set());
        setArrows(new Set());
    }, [setValues, setHiddenMainValues, setArrows]);

    return {
        values,
        hiddenMainValues,
        arrows,
        selectionMode,
        handleClick,
        toggleSelectionMode,
        hideAllMainValues,
        showAllMainValues,
        resetDisplay,
    };
};
