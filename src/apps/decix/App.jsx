import Navbar from "@common/components/Navbar";

/**
 * Composant principal de l'application Decix
 * @returns {JSX.Element} Le composant App
 */
function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar appName="Decix" />

            <main className="container mx-auto px-4 pt-20">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-4">
                        Decix - Nombres décimaux
                    </h1>
                    <p className="text-gray-600">
                        Explorez les nombres décimaux et leurs fractions sur une
                        ligne graduée interactive.
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                        Module en cours de développement
                    </p>
                </div>
            </main>
        </div>
    );
}

export default App;
