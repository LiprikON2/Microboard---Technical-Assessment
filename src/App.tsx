import { useCallback, useState } from "react";

import { Canvas } from "./components";
import "./App.css";

const App = () => {
    const [stopped, setStopped] = useState(false);
    const update = useCallback((ctx: CanvasRenderingContext2D, time: number, delta: number) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(50, 100, 20 * Math.sin(time * 0.001) ** 2, 0, 2 * Math.PI);
        ctx.fill();
    }, []);

    return (
        <>
            <button onClick={() => setStopped(!stopped)}>Stop</button>
            <Canvas update={update} stop={stopped} />
        </>
    );
};

export default App;
