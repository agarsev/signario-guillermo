import { useState } from "react";

import './signotator.css';

let tabComponent = {};

export default function Signotator ({ inputRef, updateVal }) {
    const [tab, setTab] = useState("Q");
    const appendSN = SN => {
        const cur = inputRef.current.value;
        updateVal(cur+SN); // todo: colon separation of segments etc.
    };
    const Component = tabComponent[tab];
    return <div className="Signotator">
        <nav>{["Q", "O", "L", "D", "R"].map(seg=> <button key={seg}
                disabled={tab==seg} onClick={() => setTab(seg)}>
            {seg}</button>)}</nav>
        <Component done={appendSN} />
    </div>;
}

tabComponent.Q = function ({ done }) {
    const [picam, setPicam] = useState(null);
    const [flex, setFlex] = useState("");
    const [touch, setTouch] = useState("");
    const [others, setOthers] = useState(false);
    function reset() { setPicam(null); setFlex(""); setTouch(""); setOthers(false); }
    function finish() {
        done(`:${flex===""?picam.toUpperCase():picam}${flex!=="c"?flex:""}${touch}${others?"O":""}:`);
    }

    function SelButton ({ opts }) { // current picam, value to set, display, holistic set r+O
        const choice = opts.find(o => (o[0] == picam || o[1] == picam)) || opts[0];
        const holi = choice[3];
        const actual = holi ?
            picam == choice[1] && flex == holi[0] && touch == holi[1] && others == holi[2] :
            picam == choice[1];
        return <button disabled={holi===undefined && !actual && picam !== null && picam !== choice[0]}
            className={actual?"actual":""}
            onClick={() => {
                if (actual) reset();
                else {
                    setPicam(choice[1]);
                    if (choice[3]) {
                        setFlex(choice[3][0]);
                        setTouch(choice[3][1]);
                        setOthers(choice[3][2]);
                    }
                }
            }}>{choice[2]}</button>;
    }

    function ToggleButton ({ enabled, actual, onClick, display }) {
        return <button disabled={!enabled} className={actual?"actual":""}
            onClick={actual?reset:onClick}>{display}</button>;
    }

    return <div className="grid grid-cols-4">
        <SelButton opts={[[null, "picam", "#"]]} />
        <SelButton opts={[[null, "i", "I"],
                          ["p", "pi", "L"],
                          ["m", "im", "IM"]]} />
        <SelButton opts={[[null, "ic", "V"],
                          ["p", "pic", "H"]]} />
        <SelButton opts={[[null, "icam", "B"],
                          ["ic", "ica", "W"]]} />

        <SelButton opts={[[null, "p", "P"],
                          ["i", "pi", "L"],
                          ["ic", "pic", "H"],
                          ["c", "pc", "PC"],
                          ["m", "pm", "PM"]]} />
        <SelButton opts={[[null, "m", "M"],
                          ["p", "pm", "PM"],
                          ["i", "im", "IM"]]} />
        <SelButton opts={[[null, "c", "C"],
                          ["p", "pc", "PC"]]} />
        <SelButton opts={[[null, "picam", "O"],
                          ["c", "ca", "CA"]]} />

        <div className="divider" />
        <ToggleButton enabled={true} actual={flex==""} display="E"
            onClick={() => setFlex("")} />
        <ToggleButton enabled={true} actual={flex=="c"} display="c"
            onClick={() => setFlex("c")} />
        <ToggleButton enabled={true} actual={flex=="r"} display="r"
            onClick={() => setFlex("r")} />
        <ToggleButton enabled={true} actual={flex=="g"} display="g"
            onClick={() => setFlex("g")} />

        <div className="divider" />
        <SelButton opts={[[null, "pcam", "D", ["c", "+", true]], //pcam+O
                          ["pi", "ip", "T", ["r", "", true]],   // iprO
                          ["ic", "ci", "R", ["", "", false]]]} />

        <ToggleButton enabled={["ic", "ica", "icam", "pi", "pic", "picam"].includes(picam)}
            actual={touch=="-"} display="-"
            onClick={() => setTouch("-")} />
        <ToggleButton enabled={picam?.startsWith("p")}
            actual={touch=="+"} display="+"
            onClick={() => setTouch("+")} />
        <ToggleButton enabled={picam?.length<5}
            actual={others} display="O"
            onClick={() => setOthers(!others)} />

        <SelButton opts={[[null, "pi", "F", ["r", "-", true]]]} />
        <SelButton opts={[[null, "pi", "S", ["c", "-", true]]]} />
        <SelButton opts={[[null, "pi", "LL", ["g", "+", false]]]} />

        <button disabled={picam===null} onClick={finish}>✔</button>
    </div>;
}
