import { useState } from "react";

import './style.css';
import { Q } from './q.js';
import { O } from './space.js';
import { L } from './body.js';
import { Dynam } from './dynam.js';

const tabs = {
    Q: { component: Q, next: "O" },
    O: { component: O, next: "L" },
    L: { component: L, next: "D" },
    D: { component: Dynam, next: "Q" },
    "⚙": { component: Options, next: "Q" },
};

const fixColons = /:(?=[:\] ])|(?<=[\[ ]):|^:|:$/g;

export default function Signotator ({ inputRef, updateVal }) {
    const [options, setOptions] = useLocalStorage("signotator-opts", DEF_OPTIONS);
    const [tab, setTab] = useState("D");
    const Component = tabs[tab].component;
    const appendSN = (SN, isH2) => {
        const ip = inputRef.current;
        const start = ip.selectionStart;
        const end = ip.selectionEnd;
        let before = ip.value.slice(0, start);
        let after = ip.value.slice(end);
        const upd = (before + SN + after).replace(fixColons, "");
        updateVal(upd);
        setTab(isH2?"Q":tabs[tab].next);
        let pos = upd.length-after.length;
        if (isH2) pos -= 1;
        ip.setSelectionRange(pos, pos);
        setTimeout(() => ip.setSelectionRange(pos, pos), 0);
    };
    return <div className="Signotator" onClick={e => {
        e.preventDefault(); e.stopPropagation(); inputRef.current.focus();
        }} >
        <nav>{Object.keys(tabs).map(seg=> <button key={seg}
                disabled={tab==seg} onClick={() => setTab(seg)}>
            {seg}</button>)}</nav>
        <Component done={appendSN} options={options} setOptions={setOptions} />
    </div>;
}

function Options ({ options, setOptions }) {

    function set(pref, val) { setOptions({ ...options, [pref]: val }); }

    function Radio({ text, pref, val }) {
        return <label onClick={() => set(pref, val)}>
            <input type="radio" name={pref} value={val} onChange={e => set(pref, e.target.value)}
                checked={options[pref]==val} /> {text}</label>;
    }

    return <div>
        Perspectiva:
        <Radio pref="perspective" text="Observador" val="obs" />
        <Radio pref="perspective" text="Signante" val="sign" />
    </div>;
}

const DEF_OPTIONS = {
    perspective: "sign"
};

function useLocalStorage(key, def) {
    let stored;
    try {
        stored = JSON.parse(localStorage.getItem(key));
    } catch {} 
    const [ val, set ] = useState(stored!==undefined?stored:def);
    return [ val, new_val => {
        localStorage.setItem(key, JSON.stringify(new_val));
        set(new_val);
    }];
}

