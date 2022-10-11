import { useState } from "react";

import { Direction } from "./space.js";

function Choice ({ val, actual, set, borders="" }) {
    return <td className={borders.split('').map(b => '!border-'+b).join(' ')}>
        <button className={actual==val?"actual":""}
            onClick={() => set(actual==val?null:val)}>
            {val}</button>
    </td>;
}

export function Dynam ({ done, options }) {

    const [evo, setEvo] = useState(null);
    const [gir, setGir] = useState(null);
    const [des, setDes] = useState(null);
    const [touch, setTouch] = useState(false);

    const isArc = des == "()";
    const [d0, setD0] = useState([]);
    const [d1, setD1] = useState([]);

    function finish () {
        let despl = "";
        if (isArc && d1.length != 0) {
            despl = `(${d0},${d1})`;
        } else if (isArc) {
            despl = `(${d0})`;
        } else if (des) { despl = des; }
        let next = "S";
        if (evo) next = "Q";
        else if (gir) next = "O";
        else if (des) next = "L";
        done(`:${evo||''}:${gir||''}:${despl}${touch?"*":""}:`, next)
    }

    return <div><table><tbody>
        <tr>
            <Choice val="<" actual={evo} set={setEvo} borders="b" />
            <Choice val=">" actual={evo} set={setEvo} borders="b" />
            <Choice val="w" actual={evo} set={setEvo} borders="br" />
            <td></td>
        </tr>
        <tr>
            <Choice val="$" actual={gir} set={setGir} borders="b" />
            <Choice val="%" actual={gir} set={setGir} borders="b" />
            <Choice val="/" actual={gir} set={setGir} borders="b" />
            <Choice val="8" actual={gir} set={setGir} borders="b" />
        </tr>
        <tr>
            <Choice val="()" actual={des} set={setDes} />
            <Choice val="->" actual={des} set={setDes} borders="lb" />
            <Choice val="2" actual={des} set={setDes} borders="b" />
            <Choice val="3" actual={des} set={setDes} borders="b" />
        </tr>
        <tr>
            <td colSpan="3"><div className="flex">
                <Direction val={isArc?d0:null} set={setD0} options={options} />
                <Direction val={isArc&&d0.length!=0?d1:null} set={setD1} options={options} />
            </div></td>
            <td className="!border-l">
                <button className={`${touch?"actual":""} mb-3`}
                    onClick={() => setTouch(!touch)}>✳️</button>
                <button className="finish"
                    disabled={(!evo&&!gir&&!des&&!touch) || (isArc && d0.length==0)}
                    onClick={finish}>✔</button>
            </td>
        </tr>
    </tbody></table></div>;
}

export function Syllab ({ done, options }) {
    const [sym, setSym] = useState(null);
    const [rep, setRep] = useState(null);
    const finish = () => done(`:${sym||''}${rep||''} `, "Q");
    return <div><table><tbody>
        <tr>
            <Choice val="=" actual={sym} set={setSym} borders="b" />
            <Choice val="~" actual={sym} set={setSym} borders="b" />
            <Choice val="&" actual={sym} set={setSym} borders="b" />
        </tr>
        <tr>
            <Choice val="R" actual={rep} set={setRep} borders="b" />
            <Choice val="N" actual={rep} set={setRep} borders="b" />
            <Choice val="!" actual={rep} set={setRep} borders="b" />
        </tr>
        <tr>
            <td colSpan="2"></td>
            <td className="!border-l"><button className="finish"
                disabled={!sym && !rep}
                onClick={finish}>✔</button>
            </td>
        </tr>
    </tbody></table></div>;
}
