import { useState } from "react";

import './style.css';
import { Q } from './q.js';
import { O } from './space.js';

const tabs = {
    Q: { component: Q, next: "O" },
    O: { component: O, next: "Q" },
};

const fixColons = /:(?=:)|^:|:$/g;

export default function Signotator ({ inputRef, updateVal }) {
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
        <Component done={appendSN} />
    </div>;
}
