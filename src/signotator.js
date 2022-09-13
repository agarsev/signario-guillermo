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

    return <div><table>
        <tbody>
            <tr><td>
                <SelButton opts={[[null, "i", "I"],
                          ["p", "pi", "L"],
                          ["m", "im", "IM"]]} />
            </td><td>
                <SelButton opts={[[null, "ic", "V"],
                                  ["p", "pic", "H"]]} />
            </td><td>
                <SelButton opts={[[null, "c", "C"],
                                  ["ic", "ica", "W"],
                                  ["p", "pc", "PC"]]} />
            </td><td className="!border-b">
                <SelButton opts={[[null, "icam", "B"],
                                  ["c", "ca", "CA"]]} />
            </td></tr>

            <tr><td>
                <SelButton opts={[[null, "p", "P"],
                                  ["i", "pi", "L"],
                                  ["ic", "pic", "H"],
                                  ["c", "pc", "PC"],
                                  ["m", "pm", "PM"]]} />
            </td><td>
                <SelButton opts={[[null, "m", "M"],
                                  ["p", "pm", "PM"],
                                  ["i", "im", "IM"]]} />
            </td><td>
                <SelButton opts={[[null, "picam", "O"]]} />
            </td><td className="!border-l">
                <SelButton opts={[[null, "picam", "#", ["#", "", false]]]} />
            </td></tr>

            <tr><td className="!border-y">
                <ToggleButton enabled={true} actual={flex==""} display="E"
                    onClick={() => setFlex("")} />
            </td><td className="!border-y">
                <ToggleButton enabled={true} actual={flex=="c"} display="c"
                    onClick={() => setFlex("c")} />
            </td><td className="!border-y">
                <ToggleButton enabled={true} actual={flex=="r"} display="r"
                    onClick={() => setFlex("r")} />
            </td><td className="!border-b">
                <ToggleButton enabled={true} actual={flex=="g"} display="g"
                    onClick={() => setFlex("g")} />
            </td></tr>

            <tr><td>
                <SelButton opts={[[null, "pcam", "D", ["c", "+", true]], //pcam+O
                                  ["pi", "ip", "T", ["r", "", true]],   // iprO
                                  ["ic", "ci", "R", ["", "", false]]]} />
            </td><td className="!border-l !border-b">
                <ToggleButton enabled={["ic", "ica", "icam", "pi", "pic", "picam"].includes(picam)}
                    actual={touch=="-"} display="-"
                    onClick={() => setTouch("-")} />
            </td><td className="!border-r !border-b">
                <ToggleButton enabled={picam?.startsWith("p")}
                    actual={touch=="+"} display="+"
                    onClick={() => setTouch("+")} />
            </td><td className="!border-b">
                <ToggleButton enabled={picam?.length<5}
                    actual={others} display="O"
                    onClick={() => setOthers(!others)} />
            </td></tr>

            <tr><td>
                <SelButton opts={[[null, "pi", "F", ["r", "-", true]]]} />
            </td><td>
                <SelButton opts={[[null, "pi", "S", ["c", "-", true]]]} />
            </td><td>
                <SelButton opts={[[null, "pi", "LL", ["g", "+", false]]]} />
            </td><td className="!border-l">
                <button className="finish" disabled={picam===null} onClick={finish}>✔</button>
            </td></tr>
        </tbody>
    </table></div>;
}
