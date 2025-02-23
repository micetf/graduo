import { useState } from "react";
import PropTypes from "prop-types";

const Navbar = ({ appName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isHome = appName === "Graduo";

    return (
        <nav className="fixed top-0 w-full bg-gray-800 text-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Navigation */}
                    <div className="flex items-center space-x-2">
                        <a
                            href="https://micetf.fr"
                            className="text-xl font-bold hover:text-gray-300"
                            title="Retour à l'accueil"
                        >
                            MiCetF
                        </a>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            className="h-4 w-4 fill-current text-gray-400"
                        >
                            <path d="m12.95 10.707.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                        </svg>

                        {isHome ? (
                            <span className="text-xl font-bold">Graduo</span>
                        ) : (
                            <>
                                <a
                                    href="/graduo/"
                                    className="text-gray-300 hover:text-white"
                                >
                                    Graduo
                                </a>

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="h-4 w-4 fill-current text-gray-400"
                                >
                                    <path d="m12.95 10.707.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                                </svg>

                                <span className="text-xl font-bold">
                                    {appName}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Bouton menu mobile */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden focus:outline-none"
                        aria-label="Toggle navigation"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* Actions desktop */}
                    <div className="hidden md:flex items-center space-x-2">
                        <form
                            action="https://www.paypal.com/cgi-bin/webscr"
                            method="post"
                            target="_top"
                        >
                            <button
                                type="submit"
                                className="bg-yellow-500 p-2 rounded hover:bg-yellow-600 transition-colors"
                                title="Si vous pensez que ces outils le méritent... Merci !"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    className="h-4 w-4 fill-current"
                                >
                                    <path d="m10 3.22-.61-.6a5.5 5.5 0 0 0-7.78 7.77L10 18.78l8.39-8.4a5.5 5.5 0 0 0-7.78-7.77l-.61.61z" />
                                </svg>
                            </button>
                            <input type="hidden" name="cmd" value="_s-xclick" />
                            <input
                                type="hidden"
                                name="hosted_button_id"
                                value="Q2XYVFP4EEX2J"
                            />
                        </form>

                        <a
                            href="/graduo/"
                            className="bg-gray-600 p-2 rounded hover:bg-gray-700 transition-colors"
                            title="Voir tous les outils Graduo"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                className="h-4 w-4 fill-current"
                            >
                                <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                            </svg>
                        </a>

                        <a
                            href="mailto:webmaster@micetf.fr"
                            className="bg-gray-600 p-2 rounded hover:bg-gray-700 transition-colors"
                            title="Contacter le webmaster"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                className="h-4 w-4 fill-current"
                            >
                                <path d="M18 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2h16zm-4.37 9.1L20 16v-2l-5.12-3.9L20 6V4l-10 8L0 4v2l5.12 4.1L0 14v2l6.37-4.9L10 14l3.63-2.9z" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Menu mobile */}
                <div
                    className={`md:hidden ${isOpen ? "block" : "hidden"} pb-4`}
                >
                    <a
                        href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Q2XYVFP4EEX2J"
                        className="block py-2 text-gray-300 hover:text-white"
                        target="_top"
                    >
                        Faire un don
                    </a>
                    <a
                        href="/graduo/"
                        className="block py-2 text-gray-300 hover:text-white"
                    >
                        Tous les outils Graduo
                    </a>
                    <a
                        href="mailto:webmaster@micetf.fr"
                        className="block py-2 text-gray-300 hover:text-white"
                    >
                        Contact
                    </a>
                </div>
            </div>
        </nav>
    );
};

Navbar.propTypes = {
    appName: PropTypes.string.isRequired,
};

export default Navbar;
