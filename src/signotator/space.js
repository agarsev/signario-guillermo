import { useState } from "react";

import { isInH2 } from "./body.js";

const opposite = {
    F: "B", B: "F",
    X: "Y", Y: "X",
    H: "L", L: "H"
};

export function rotate (dir) {
    if ("HL".includes(dir)) return dir;
    return opposite[dir];
}

export function mirror (dir) {
    if (dir=="Y") return "X";
    if (dir=="X") return "Y";
    return dir;
}

export function Direction ({ val, set, options }) {
    const invert = options.perspective == "obs";
    function Arrow({ invariant, dir, path }) {
        if (options.perspective=="obs") {
            dir = rotate(dir);
        }
        const opo = opposite[dir];
        let cn = "Arrow";
        let click = null;
        if (val === null) {
            cn += " disabled";
        } else if (val.includes(dir)) {
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
        <Arrow dir="F" path="m 133.66599,62.189793 -16.63545,6.86199 8.18301,0.0785 -5.84265,8.538184 7.35789,0.07058 5.84265,-8.538184 8.18299,0.0785 z" />
        <Arrow dir="H" invariant={true} path="m 120.15121,52.244762 -9.71724,10.715056 h 6.70347 v 13.114959 h 6.02754 V 62.959818 h 6.70346 z" />
        <Arrow dir="X" path="m 91.006791,81.042921 5.856436,7.820849 3.351733,-5.395239 h 13.11496 l 3.01377,-4.851221 h -13.11496 l 3.35173,-5.395231 z" />
        <Arrow dir="Y" path="m 150.49164,81.125927 -5.85643,-7.820849 -3.35174,5.395239 h -13.11496 l -3.01377,4.851221 h 13.11496 l -3.35173,5.395231 z" />
        <Arrow dir="L" invariant={true} path="m 121.34719,109.92412 9.71724,-10.715056 h -6.70347 V 86.094105 h -6.02754 v 13.114959 h -6.70346 z" />
        <Arrow dir="B" path="m 107.83243,99.97909 16.63545,-6.86199 -8.18301,-0.0785 5.84265,-8.538184 -7.35789,-0.07059 -5.84264,8.538184 -8.183,-0.0785 z" />
    </svg>;
}

export function O ({ done, options }) {
    const [palmar, setPalmar] = useState([]);
    const [distal, setDistal] = useState([]);
    const finish = () => {
        if (palmar.length == 0 && distal.length == 0) {
            done("", "L");
        } else {
            done((before, after) => {
                let p, d;
                if (isInH2(before, after)) {
                    p = palmar.map(mirror);
                    d = distal.map(mirror);
                } else {
                    p = palmar; d = distal;
                }
                return [before+p.join('')+d.join('').toLowerCase(),
                    after, "L"];
            });
        }
    }

    return <div><table>
        <tbody>
            <tr><th>Palma</th><th>Dedos</th></tr>
            <tr><td>
                <Direction val={palmar} set={setPalmar} options={options} />
            </td><td>
                <Direction val={distal} set={setDistal} options={options} />
            </td></tr>
            <tr><td colSpan="2" className="text-right"><button className="finish"
                onClick={finish}>✔</button>
            </td></tr>
        </tbody>
    </table></div>;
}

