import { useState, useCallback } from "react";
import { snapToTimeGraduation } from "../utils/timeUtils";
import { isMainTimeValue } from "../utils/timeFormatter";
import {
    calculateOptimalTimeSubdivisions,
    generateSubdivisionValues,
} from "../utils/adaptiveSubdivisions";

/**
 * Hook gérant les interactions avec la ligne graduée temporelle
 * @param {Object} settings - Paramètres de configuration de la ligne
 * @param {Function} getValueFromPosition - Fonction de conversion position → valeur
 * @param {Object} externalState - État externe (optionnel)
 * @param {string} externalSelectionMode - Mode de sélection externe (optionnel)
 * @returns {Object} États et fonctions de gestion des interactions
 */
export const useGraduationInteractionsTime = (
    settings,
    getValueFromPosition,
    externalState = null,
    externalSelectionMode = null
) => {
    // État local
    const [localValues, setLocalValues] = useState(new Set());
    const [localHiddenMainValues, setLocalHiddenMainValues] = useState(
        new Set()
    );
    const [localHiddenSubValues, setLocalHiddenSubValues] = useState(new Set());
    const [localArrows, setLocalArrows] = useState(new Set());
    const [localSelectionMode, setLocalSelectionMode] = useState("normal");

    // Utilise soit l'état externe soit l'état local
    const values = externalState?.values || localValues;
    const hiddenMainValues =
        externalState?.hiddenMainValues || localHiddenMainValues;
    const hiddenSubValues =
        externalState?.hiddenSubValues || localHiddenSubValues;
    const arrows = externalState?.arrows || localArrows;
    const selectionMode = externalSelectionMode || localSelectionMode;

    const setValues = externalState?.setValues || setLocalValues;
    const setHiddenMainValues =
        externalState?.setHiddenMainValues || setLocalHiddenMainValues;
    const setHiddenSubValues =
        externalState?.setHiddenSubValues || setLocalHiddenSubValues;
    const setArrows = externalState?.setArrows || setLocalArrows;

    /**
     * Gère les clics sur la ligne graduée temporelle selon le mode actif
     * @param {Event} event - Événement de clic
     * @param {number} width - Largeur de la zone de dessin
     * @param {boolean} isAbove - Indique si le clic est au-dessus de la ligne (true) ou en-dessous (false)
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
                // Détermine si le clic est au-dessus ou en-dessous de la ligne
                if (isAbove) {
                    // Déterminer si c'est une graduation principale
                    const isMainValue = isMainTimeValue(clickedValue, settings);

                    // MODE SÉLECTION
                    if (selectionMode === "selection") {
                        // En mode sélection, toute valeur est sélectionnable
                        // sans impact sur l'affichage/masquage
                        setValues((prev) => {
                            const newValues = new Set(prev);
                            newValues.has(clickedValue)
                                ? newValues.delete(clickedValue)
                                : newValues.add(clickedValue);
                            return newValues;
                        });
                    }
                    // MODE AFFICHAGE
                    else {
                        // En mode affichage, on gère uniquement l'affichage/masquage
                        // sans impact sur la sélection
                        if (isMainValue) {
                            // Graduation principale
                            setHiddenMainValues((prev) => {
                                const newHidden = new Set(prev);
                                newHidden.has(clickedValue)
                                    ? newHidden.delete(clickedValue)
                                    : newHidden.add(clickedValue);
                                return newHidden;
                            });
                        } else {
                            // Sous-graduation
                            setHiddenSubValues((prev) => {
                                const newHidden = new Set(prev);
                                newHidden.has(clickedValue)
                                    ? newHidden.delete(clickedValue)
                                    : newHidden.add(clickedValue);
                                return newHidden;
                            });
                        }
                    }
                }
                // Clic sous la ligne (identique dans les deux modes)
                else {
                    // Ajoute/retire une flèche rouge
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
            setValues,
            setHiddenMainValues,
            setHiddenSubValues,
            setArrows,
        ]
    );

    /**
     * Bascule entre le mode normal (affichage) et le mode sélection
     */
    const toggleSelectionMode = useCallback(() => {
        setLocalSelectionMode((prev) =>
            prev === "normal" ? "selection" : "normal"
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
     * Masque toutes les sous-graduations
     */
    const hideAllSubValues = useCallback(() => {
        setHiddenSubValues(new Set());
    }, [setHiddenSubValues]);

    /**
     * Affiche toutes les sous-graduations
     */
    const showAllSubValues = useCallback(() => {
        const [start, end] = settings.intervals;
        const subValues = new Set();

        // Parcourir l'ensemble des intervalles
        for (let i = start; i <= end; i += settings.step) {
            if (i + settings.step <= end) {
                // Calculer les subdivisions optimales
                const subdivInfo = calculateOptimalTimeSubdivisions(settings);
                // Générer les sous-graduations
                const subdivValues = generateSubdivisionValues(
                    i,
                    i + settings.step,
                    subdivInfo
                );

                // Ajouter chaque sous-graduation à l'ensemble
                for (const subValue of subdivValues) {
                    subValues.add(subValue);
                }
            }
        }

        setHiddenSubValues(subValues);
    }, [settings, setHiddenSubValues]);

    /**
     * Réinitialise complètement l'affichage (efface tout)
     */
    const resetDisplay = useCallback(() => {
        setValues(new Set());
        setHiddenMainValues(new Set());
        setHiddenSubValues(new Set());
        setArrows(new Set());
    }, [setValues, setHiddenMainValues, setHiddenSubValues, setArrows]);

    return {
        values,
        hiddenMainValues,
        hiddenSubValues,
        arrows,
        selectionMode,
        handleClick,
        toggleSelectionMode,
        hideAllMainValues,
        showAllMainValues,
        hideAllSubValues,
        showAllSubValues,
        resetDisplay,
    };
};
