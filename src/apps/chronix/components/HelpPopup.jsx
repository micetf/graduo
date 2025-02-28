// src/apps/chronix/components/HelpPopup.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

/**
 * Composant affichant une fenêtre d'aide contextuelle
 * @param {Object} props Les propriétés du composant
 * @param {boolean} props.isOpen État d'ouverture du popup
 * @param {Function} props.onClose Fonction appelée lors de la fermeture
 * @returns {JSX.Element|null} Le composant HelpPopup ou null s'il est fermé
 */
const HelpPopup = ({ isOpen, onClose }) => {
    // État pour mémoriser la préférence de ne plus afficher automatiquement
    const [dontShowAgain, setDontShowAgain] = useState(false);

    // Effet pour gérer la touche Echap pour fermer le popup
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Si le popup n'est pas ouvert, on ne rend rien
    if (!isOpen) return null;

    // Gestion de la fermeture avec mémorisation de la préférence
    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem("hideChronixHelpOnStartup", "true");
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-xl font-bold">
                        Guide d&lsquo;utilisation de Chronix
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        aria-label="Fermer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg">
                            Comment utiliser cette ligne graduée temporelle ?
                        </h3>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>
                                En mode affichage, cliquez{" "}
                                <strong>au-dessus</strong> de la ligne pour
                                afficher ou masquer une valeur temporelle
                            </li>
                            <li>
                                En mode sélection, cliquez{" "}
                                <strong>au-dessus</strong> de la ligne pour
                                sélectionner une valeur à comparer
                            </li>
                            <li>
                                Dans les deux modes, cliquez{" "}
                                <strong>en-dessous</strong> de la ligne pour
                                placer une flèche rouge
                            </li>
                            <li>
                                Utilisez la barre d&lsquo;outils pour changer de
                                mode, afficher/masquer les graduations ou
                                réinitialiser l&lsquo;affichage
                            </li>
                            <li>
                                Sélectionnez deux points pour mesurer
                                automatiquement une durée
                            </li>
                            <li>
                                Effectuez des opérations temporelles (addition,
                                soustraction, etc.) avec les valeurs
                                sélectionnées
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg">
                            Applications pédagogiques
                        </h3>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Visualisation de durées et d&lsquo;horaires</li>
                            <li>Calcul d&lsquo;intervalles de temps</li>
                            <li>
                                Conversion entre différentes unités temporelles
                            </li>
                            <li>Résolution de problèmes impliquant le temps</li>
                            <li>
                                Représentation des fractions de temps (quart
                                d&lsquo;heure, demi-journée...)
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg">
                            Caractéristiques particulières
                        </h3>
                        <p className="mt-1">
                            Cette ligne graduée utilise un système de
                            subdivisions adaptatives qui s&lsquo;ajuste
                            intelligemment en fonction de l&lsquo;unité de
                            temps, du pas choisi et de l&lsquo;intervalle
                            affiché, pour refléter les propriétés naturelles des
                            mesures de temps.
                        </p>
                    </div>
                </div>

                <div className="border-t p-4 flex justify-end">
                    <label className="flex items-center mr-auto text-sm text-gray-600">
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                        />
                        Ne plus afficher au démarrage
                    </label>
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Compris
                    </button>
                </div>
            </div>
        </div>
    );
};

HelpPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default HelpPopup;
