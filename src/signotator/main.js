import { useState } from "react";

import './style.css';
import { Q } from './q.js';
import { O } from './space.js';
import { L } from './body.js';
import { Dynam, Syllab } from './dynam.js';

const tabs = { Q, O, L,
    D: Dynam, S: Syllab,
    "⚙": Options,
};

const fixColons = /:(?=[:\] ])|(?<=[\[ ]):|^:|:$/g;

export default function Signotator ({ inputRef, updateVal }) {
    const [options, setOptions] = useLocalStorage("signotator-opts", DEF_OPTIONS);
    const [tab, setTab] = useState("Q");
    const Component = tabs[tab];
    const appendSN = (SN, nextTab, inset) => {
        const ip = inputRef.current;
        const start = ip.selectionStart;
        const end = ip.selectionEnd;
        let before = ip.value.slice(0, start);
        let after = ip.value.slice(end);
        const upd = (before + SN + after).replace(fixColons, "");
        updateVal(upd);
        setTab(nextTab);
        let pos = upd.length-after.length;
        if (inset) pos -= 1;
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

    return <div><table><tbody>
        <tr>
            <th>Perspectiva:</th>
            <td><Radio pref="perspective" text="Observador" val="obs" /></td>
            <td><Radio pref="perspective" text="Signante" val="sign" /></td>
        </tr>
    </tbody></table></div>;
}

const DEF_OPTIONS = {
    perspective: "sign"
};

function useLocalStorage(key, def) {
    let stored;
    try {
        stored = JSON.parse(localStorage.getItem(key));
    } catch {}
    if (stored===undefined || stored===null) stored = def;
    const [ val, set ] = useState(stored);
    return [ val, new_val => {
        localStorage.setItem(key, JSON.stringify(new_val));
        set(new_val);
    }];
}

