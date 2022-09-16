import { useState } from "react";

import './style.css';
import { Q } from './q.js';
import { O } from './space.js';

const tabs = {
    Q: { component: Q, next: "O" },
    O: { component: O, next: "Q" },
    "⚙": { component: Options, next: "Q" },
};

const fixColons = /:(?=:)|^:|:$/g;

export default function Signotator ({ inputRef, updateVal }) {
    const [options, setOptions] = useLocalStorage("signotator-opts", DEF_OPTIONS);
    const [tab, setTab] = useState("Q");
    const Component = tabs[tab].component;
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
        setTab(tabs[tab].next);
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

