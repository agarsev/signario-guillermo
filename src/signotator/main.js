import { useState } from "react";

import './style.css';
import { Q } from './q.js';
import { O } from './space.js';
import { L, isInH2 } from './body.js';
import { Dynam, Syllab } from './dynam.js';

const tabs = { Q, O, L,
    M: Dynam, S: Syllab,
    "⚙": Options,
};

export default function Signotator ({ inputRef, updateVal }) {
    const [options, setOptions] = useLocalStorage("signotator-opts", DEF_OPTIONS);
    const [tab, setTab] = useState("Q");
    const Component = tabs[tab];
    const setCursor = pos => {
        const ip = inputRef.current;
        ip.setSelectionRange(pos, pos);
        setTimeout(() => ip.setSelectionRange(pos, pos), 0);
    };
    const clickTab = tab => { // If we change segment and inside a H2 bracket, move cursor too
        setTab(tab);
        if (!"MS".includes(tab)) return;
        const ip = inputRef.current;
        const start = ip.selectionStart;
        const end = ip.selectionEnd;
        if (start != end) return;
        const before = ip.value.slice(0, start);
        const after = ip.value.slice(end);
        if (!isInH2(before, after)) return;
        let endword = after.indexOf(" ");
        setCursor(before.length+(endword>=0?endword:after.length));
    };
    const appendSN = (SN, nextTab) => {
        const ip = inputRef.current;
        const start = ip.selectionStart;
        const end = ip.selectionEnd;
        let before = ip.value.slice(0, start);
        let after = ip.value.slice(end);
        if (before.length > 0 && !":[ ".includes(before[before.length-1])) {
            before = before + ":";
        }
        if (after.length > 0 && !":] ".includes(after[0])) {
            after = ":" + after;
        }
        if (typeof SN == "function") {
            [before, after, nextTab] = SN(before, after);
        } else {
            before = before + SN;
        }
        updateVal(before+after);
        setTab(nextTab);
        setCursor(before.length);
    };
    return <div className="Signotator" onClick={e => {
        e.preventDefault(); e.stopPropagation(); inputRef.current.focus();
        }} >
        <nav>{Object.keys(tabs).map(seg=> <button key={seg}
                disabled={tab==seg} onClick={() => clickTab(seg)}>
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

