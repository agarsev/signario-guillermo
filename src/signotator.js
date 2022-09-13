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
    function SelButton ({ opts }) {
        const choice = opts.find(o => (o[0] == picam || o[1] == picam)) || opts[0];
        const actual = picam == choice[1];
        return <button disabled={!actual && picam !== null && picam !== choice[0]}
            className={actual?"actual":""}
            onClick={() => setPicam(actual?null:choice[1])}>{choice[2]}</button>;
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
        <button>c</button>
        <button>r</button>
        <button>g</button>

        <div className="divider" />
        <button>-</button>
        <button>+</button>
        <button>O</button>

        <div className="divider" />
        <button className="col-end-5" onClick={() => done(picam)}>✔</button>
    </div>;
}
