import Navbar from "@common/components/Navbar";

const apps = [
    {
        id: "natix",
        title: "Natix",
        description:
            "Manipulation des nombres entiers et leurs fractions sur une ligne graduée",
        icon: "1️⃣",
        path: "/graduo/natix/",
        color: "bg-blue-100 hover:bg-blue-200",
        border: "border-blue-200",
    },
    {
        id: "decix",
        title: "Decix",
        description:
            "Exploration des nombres décimaux et leurs fractions sur une ligne graduée",
        icon: "🔢",
        path: "/graduo/decix/",
        color: "bg-green-100 hover:bg-green-200",
        border: "border-green-200",
        comingSoon: true,
    },
    {
        id: "metrix",
        title: "Metrix",
        description:
            "Découverte des mesures de longueur et leurs fractions sur une ligne graduée",
        icon: "📏",
        path: "/graduo/metrix/",
        color: "bg-indigo-100 hover:bg-indigo-200",
        border: "border-indigo-200",
        comingSoon: true,
    },

    {
        id: "chronix",
        title: "Chronix",
        description:
            "Visualisation des durées et leurs fractions sur une ligne graduée",
        icon: "⏰",
        path: "/graduo/chronix/",
        color: "bg-purple-100 hover:bg-purple-200",
        border: "border-purple-200",
        comingSoon: true,
    },
    {
        id: "degrix",
        title: "Degrix",
        description:
            "Représentation des angles et leurs fractions sur une ligne graduée",
        icon: "📐",
        path: "/graduo/degrix/",
        color: "bg-red-100 hover:bg-red-200",
        border: "border-red-200",
        comingSoon: true,
    },
    {
        id: "monetix",
        title: "Monetix",
        description:
            "Manipulation de la monnaie et ses fractions sur une ligne graduée",
        icon: "💶",
        path: "/graduo/monetix/",
        color: "bg-yellow-100 hover:bg-yellow-200",
        border: "border-yellow-200",
        comingSoon: true,
    },
];

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar appName="Graduo" />

            <main className="container mx-auto px-4 pt-20 pb-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        La ligne graduée au service des mathématiques
                    </h1>
                    <p className="text-xl text-gray-600">
                        Outils interactifs pour explorer et comprendre les
                        nombres, les mesures et leurs fractions à travers la
                        manipulation de lignes graduées
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map((app) => (
                        <div
                            key={app.id}
                            className={`relative rounded-lg border-2 ${app.border} ${app.color} p-6 transition-all duration-300`}
                        >
                            {app.comingSoon && (
                                <div className="absolute top-2 right-2 bg-gray-600 text-white text-xs px-2 py-1 rounded">
                                    Bientôt disponible
                                </div>
                            )}
                            <div className="text-4xl mb-4">{app.icon}</div>
                            <h2 className="text-2xl font-bold mb-2">
                                {app.title}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {app.description}
                            </p>
                            <a
                                href={app.comingSoon ? "#" : app.path}
                                className={`inline-block ${
                                    app.comingSoon
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                } text-white font-semibold px-4 py-2 rounded transition-colors`}
                            >
                                {app.comingSoon
                                    ? "En développement"
                                    : "Accéder à l'outil"}
                            </a>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="border-t mt-12">
                <div className="container mx-auto px-4 py-6 text-center text-gray-600">
                    <p>© 2024 MiCetF - Tous droits réservés</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
