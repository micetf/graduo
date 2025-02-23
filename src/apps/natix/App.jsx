// src/App.jsx
import { useState, useMemo } from "react";
import ControlPanel from "./components/ControlPanel";
import GraduatedLine from "@common/components/GraduatedLine";
import Navbar from "@common/components/Navbar";
import { useGraduationInteractions } from "@common/hooks";

const DEFAULT_SETTINGS = {
    notation: "decimal",
    intervals: [0, 10],
    denominator: 4,
    step: 1,
};

function App() {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [values, setValues] = useState(new Set());
    const [hiddenMainValues, setHiddenMainValues] = useState(new Set());
    const [arrows, setArrows] = useState(new Set());

    const { hideAllMainValues, showAllMainValues, resetDisplay } =
        useGraduationInteractions(settings, null, {
            values,
            hiddenMainValues,
            arrows,
            setValues,
            setHiddenMainValues,
            setArrows,
        });

    const handleStateChange = (stateType, newState) => {
        switch (stateType) {
            case "values":
                setValues(newState);
                break;
            case "hiddenMainValues":
                setHiddenMainValues(newState);
                break;
            case "arrows":
                setArrows(newState);
                break;
        }
    };

    const areAllMainValuesHidden = useMemo(() => {
        const mainValuesCount =
            Math.floor(
                (settings.intervals[1] - settings.intervals[0]) / settings.step
            ) + 1;
        return hiddenMainValues.size === mainValuesCount;
    }, [hiddenMainValues, settings.intervals, settings.step]);

    const handleSettingsChange = (newSettings) => {
        const validatedSettings = {
            ...newSettings,
            intervals: [
                Math.min(
                    newSettings.intervals[0],
                    newSettings.intervals[1] - 1
                ),
                Math.max(
                    newSettings.intervals[1],
                    newSettings.intervals[0] + 1
                ),
            ],
        };
        setSettings(validatedSettings);
    };

    return (
        <>
            <Navbar appName="Natix" />
            <div className="container mx-auto p-4 pt-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                        <ControlPanel
                            settings={settings}
                            onSettingsChange={handleSettingsChange}
                            onResetDisplay={resetDisplay}
                            onHideMainValues={hideAllMainValues}
                            onShowMainValues={showAllMainValues}
                            areAllMainValuesHidden={areAllMainValuesHidden}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <GraduatedLine
                            settings={settings}
                            values={values}
                            hiddenMainValues={hiddenMainValues}
                            arrows={arrows}
                            onStateChange={handleStateChange}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
