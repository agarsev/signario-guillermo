import { useState } from "react";

import './signotator.css';

let tabComponent = {};

const fixColons = /:(?=:)|^:|:$/g;

export default function Signotator ({ inputRef, updateVal }) {
    const [tab, setTab] = useState("Q");
    const Component = tabComponent[tab];
    const appendSN = SN => {
        const ip = inputRef.current;
        const start = ip.selectionStart;
        const end = ip.selectionEnd;
        let before = ip.value.slice(0, start);
        let after = ip.value.slice(end);
        if ((start == end) && (start < ip.value.length)) {
            before = before.slice(0, before.lastIndexOf(":"));
            let aio = after.indexOf(":");
            after = aio<0?"":after.slice(aio);
        }
        const upd = before + SN + after;
        updateVal(upd.replace(fixColons, ""));
        setTab(Component.nextTab);
    };
    return <div className="Signotator" onClick={e => {
        e.preventDefault(); e.stopPropagation(); inputRef.current.focus();
        }} >
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

tabComponent.Q.nextTab = "O";

tabComponent.O = function ({ done }) {
    const [palmar, setPalmar] = useState([]);
    const [distal, setDistal] = useState([]);
    return <div><table>
        <tbody>
            <tr><th>Palma</th><th>Dedos</th></tr>
            <tr><td className="h-32">
                <Direction val={palmar} set={setPalmar} />
            </td><td className="h-32">
                <Direction val={distal} set={setDistal} />
            </td></tr>
            <tr><td colSpan="2" className="text-right"><button className="finish"
                disabled={palmar.length==0 && distal.length==0}
                onClick={() => done(`:${palmar.join('')}${distal.join('').toLowerCase()}:`)}>✔</button>
            </td></tr>
        </tbody>
    </table></div>;
}

tabComponent.O.nextTab = "Q";

function Direction ({ val, set }) {
    function Arrow({ dir, opo, path }) {
        let cn = "Arrow";
        let click = null;
        if (val.includes(dir)) {
            cn += " actual";
            click = () => set(val.filter(d => d!=dir));
        } else if (val.length == 2 || val.includes(opo)) {
            cn += " disabled";
        } else {
            cn += " enabled";
            click = () => set(val.concat([dir]));
        }
        return <path d={path} className={cn} onClick={click} />;
    }
    return <svg className="w-full h-full" viewBox="90 52 62 58">
        <Arrow dir="F" opo="B" path="m 133.66599,62.189793 -16.63545,6.86199 8.18301,0.0785 -5.84265,8.538184 7.35789,0.07058 5.84265,-8.538184 8.18299,0.0785 z" />
        <Arrow dir="H" opo="L" path="m 120.15121,52.244762 -9.71724,10.715056 h 6.70347 v 13.114959 h 6.02754 V 62.959818 h 6.70346 z" />
        <Arrow dir="X" opo="Y" path="m 91.006791,81.042921 5.856436,7.820849 3.351733,-5.395239 h 13.11496 l 3.01377,-4.851221 h -13.11496 l 3.35173,-5.395231 z" />
        <Arrow dir="Y" opo="X" path="m 150.49164,81.125927 -5.85643,-7.820849 -3.35174,5.395239 h -13.11496 l -3.01377,4.851221 h 13.11496 l -3.35173,5.395231 z" />
        <Arrow dir="L" opo="H" path="m 121.34719,109.92412 9.71724,-10.715056 h -6.70347 V 86.094105 h -6.02754 v 13.114959 h -6.70346 z" />
        <Arrow dir="B" opo="F" path="m 107.83243,99.97909 16.63545,-6.86199 -8.18301,-0.0785 5.84265,-8.538184 -7.35789,-0.07059 -5.84264,8.538184 -8.183,-0.0785 z" />
    </svg>;
}
