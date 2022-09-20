import { useState } from "react";

import { Direction } from "./space.js";

export function Dynam ({ done, options }) {

    const [evo, setEvo] = useState(null);
    const [gir, setGir] = useState(null);
    const [des, setDes] = useState(null);

    const isArc = des == "()";
    const [d0, setD0] = useState([]);
    const [d1, setD1] = useState([]);

    function finish () {
        let despl = "";
        if (isArc && d1.length != 0) {
            despl = `(${d0},${d1})`;
        } else if (isArc) {
            despl = `(${d0})`;
        } else { despl = des; }
        done(`:${evo||''}:${gir||''}:${despl}:`)
    }

    function Choice ({ val, actual, set }) {
        return <button className={actual==val?"actual":""}
            onClick={() => set(actual==val?null:val)}>
            {val}
        </button>;
    }

    return <div><table><tbody>
        <tr>
            <td className="!border-b"><Choice val="<" actual={evo} set={setEvo} /></td>
            <td className="!border-b"><Choice val=">" actual={evo} set={setEvo} /></td>
            <td className="!border-b"><Choice val="w" actual={evo} set={setEvo} /></td>
            <td className="!border-b"></td>
        </tr>
        <tr>
            <td className="!border-b"><Choice val="$" actual={gir} set={setGir} /></td>
            <td className="!border-b"><Choice val="%" actual={gir} set={setGir} /></td>
            <td className="!border-b"><Choice val="/" actual={gir} set={setGir} /></td>
            <td className="!border-b"><Choice val="8" actual={gir} set={setGir} /></td>
        </tr>
        <tr>
            <td><Choice val="()" actual={des} set={setDes} /></td>
            <td className="!border-l !border-b"><Choice val="->" actual={des} set={setDes} /></td>
            <td className="!border-b"><Choice val="2" actual={des} set={setDes} /></td>
            <td className="!border-b"><Choice val="3" actual={des} set={setDes} /></td>
        </tr>
        <tr>
            <td colSpan="3"><div className="flex">
                <Direction val={isArc?d0:null} set={setD0} options={options} />
                <Direction val={isArc&&d0.length!=0?d1:null} set={setD1} options={options} />
            </div></td>
            <td className="!border-l"><button className="finish"
                disabled={isArc && d0.length==0}
                onClick={finish}>✔</button>
            </td>
        </tr>
    </tbody></table></div>;
}
