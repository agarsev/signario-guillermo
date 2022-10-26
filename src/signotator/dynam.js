import { useState } from "react";

import { Direction } from "./space.js";

function Choice ({ val, actual, set, borders="" }) {
    const cont = val in paths ?
        <svg style={{ width: "100%", padding: 0,
            fill: "none", strokeWidth: 1.25,
            strokeLinecap: "round", strokeLinejoin: "round"
        }} viewBox="0 0 32 32">
        <path d={paths[val]} />
    </svg>: val;
    return <td className={borders.split('').map(b => '!border-'+b).join(' ')}>
        <button className={actual?.includes(val)?"actual":""}
            onClick={() => set(actual==val?null:val)}>
            {cont}</button>
    </td>;
}

export function Dynam ({ done, options }) {

    const [evo, setEvo] = useState(null);
    const [gir, setGir] = useState(null);
    const [des, setDes] = useState(null);
    const [touch, setTouch] = useState(false);
    const [fore, setFore] = useState(false);

    const isArc = des && des[0] == "(";
    const [d0, setD0] = useState([]);
    const [d1, setD1] = useState([]);

    const finish = () => {
        let res = [];
        let next;
        if (evo) { next = "Q"; res.push(evo); }
        if (gir) { next = next || "O"; res.push(gir); }
        if (des) {
            next = next || "L";
            if (isArc && d1.length != 0) {
                res.push(`(${d0},${d1})`);
            } else if (isArc) {
                res.push(`(${d0})`);
            } else {
                res.push(des);
            }
        }
        if (touch) res[res.length-1] += "*";
        if (!next) next = "S";
        res = res.join(':');
        if (fore) {
            done((before, after) => {
                const wordstart = before.lastIndexOf(" ")+1;
                before = before.substring(0, wordstart)+"_"+before.substring(wordstart);
                return [before+res, after, next];
            });
        } else { done(res, next); }
    };

    return <div><table><tbody>
        <tr>
            <Choice val="<" actual={evo} set={setEvo} borders="b" />
            <Choice val=">" actual={evo} set={setEvo} borders="b" />
            <Choice val={evo?.includes("<")?"<w":evo?.includes(">")?">w":"w"} actual={evo} set={setEvo} borders="br" />
            <td><button className={fore?"actual":""} onClick={() => setFore(!fore)}>_</button></td>
        </tr>
        <tr>
            <Choice val="$" actual={gir} set={setGir} borders="b" />
            <Choice val="%" actual={gir} set={setGir} borders="b" />
            <Choice val="/" actual={gir} set={setGir} borders="b" />
            <Choice val="8" actual={gir} set={setGir} borders="b" />
        </tr>
        <tr>
            {d0.length>0&&d1.length>0?<Choice val="()" actual={des} set={setDes} />
            :<Choice val="())" actual={des} set={setDes} />}
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
    const finish = () => done(`${sym||''}${rep||''}`, "Q");
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

const paths = {
    "<": "M 3.2011954,7.4208602 C 2.6702423,11.315035 3.9553799,13.716069 7.0604622,14.056763 M 1.3251764,9.0368347 3.2011954,7.4208602 5.0762134,9.0331147 M 3.2810497,22.353771 c 0,-2.98224 0.7184877,-4.582408 3.561695,-5.098804 m -5.4377131,3.48283 1.8760181,1.615974 1.875019,-1.612254 m -0.8896952,7.329162 c 4.4219156,-1.773567 4.7717813,0.951587 4.7717813,0.951587 m 9.1108402,-6.807949 c -2.175105,-0.587453 -4.770898,-0.799182 -7.361951,-0.32652 -4.0130505,0.732064 -6.3350527,2.674135 -6.7304176,4.278784 -0.3953648,1.604647 0.8174644,3.725347 0.8174644,3.725347 l 6.1926112,-1.402816 c 0.752119,0.106389 1.331051,0.469899 2.441831,0.0438 1.29216,0.07197 3.222799,-0.0046 4.379077,0.739659 M 7.5932034,2.8574272 c 3.9862486,3.396775 5.6921716,1.4110137 5.6921716,1.4110137 M 21.91138,15.848917 9.1563791,9.2079997 C 5.0066253,7.0474222 6.0186522,3.9208894 8.4076591,1.5987094 L 26.505188,11.021226 c 2.024907,0.816742 3.527899,1.958234 4.200751,3.342049",
    ">": "m 5.5423387,25.919325 c 0,2.900005 0.277027,4.064015 2.289009,4.593586 m -4.165028,-2.977612 1.876019,-1.615974 1.875018,1.612254 M 6.2160237,6.7901279 c 0,-2.6803533 0.027374,-5.263137 3.0189863,-5.263137 m -4.8950043,3.647163 1.876018,1.615974 1.875019,-1.612254 M 2.0957893,21.24639 c 4.7643031,0.01711 4.0650138,2.67415 4.0650138,2.67415 M 19.639918,21.541654 C 17.755238,19.850779 14.506992,18.781258 11.423875,18.38198 7.3783826,17.858071 3.5856673,18.064248 2.6165589,19.402919 1.6474513,20.741588 1.9749708,23.16255 1.9749708,23.16255 l 6.1160709,1.160432 c 0.6570946,0.381088 1.05711,0.935425 2.2466023,0.957722 1.473252,0.694783 3.819229,1.15499 4.20515,2.559394 M 3.317005,9.7978219 C 8.1963809,11.70044 9.1572224,9.2652389 9.1572224,9.2652389 M 21.102334,17.378787 6.8752841,15.285256 C 2.2466093,14.60414 2.1779875,11.318612 3.6739167,8.3416892 L 23.860075,11.312112 c 3.822244,0.189203 6.456699,1.846445 6.189961,5.096376",
    ">w": "M 3.5508156,9.8139002 C 5.5011484,3.6990737 12.004564,2.7673332 15.063914,3.023456 M 2.3034909,7.6749757 3.5508156,9.8139002 5.8487399,8.9003332 M 4.4491388,15.270475 c 5.53425,0.07705 5.5729262,-2.421258 5.5729262,-2.421258 M 21.17097,23.866175 c -1.394935,-0.928821 -6.479371,-3.913866 -7.514956,-5.083708 l -4.2357545,0.04103 C 5.3362245,18.863047 3.8846376,17.197502 4.2633879,13.69697 7.1866342,12.803502 9.1919066,12.576702 12.294544,12.56893 M 11.233437,7.9052514 c 4.709789,2.9071866 6.025511,0.7830608 6.025511,0.7830608 M 21.17097,23.866175 C 20.450694,22.352981 17.619773,17.181147 17.331611,15.645593 L 13.67554,13.506332 C 10.150424,11.443695 9.7597365,9.2691822 11.881805,6.4595555 c 3.709786,0.9175664 5.65331,1.9927897 9.659309,4.4967115 M 5.0339513,23.0594 c 4.1102751,-1.077346 3.6091392,-2.868558 3.6091392,-2.868558 m 10.3666945,10.0908 C 18.29121,27.294033 17.872873,25.929707 16.934148,24.648293 15.705301,24.27071 13.385625,24.088019 12.371499,23.464869 L 9.5596015,24.734727 C 6.7129771,26.02027 5.0249753,24.550421 4.5628933,21.974233 7.0295717,20.429125 8.7475123,19.67884 12.261091,18.778304 M 27.091819,4.2547496 c -1.17199,5.1043746 1.37715,5.7004626 1.37715,5.7004626 M 21.421919,30.14536 V 8.5740012 c 0,-4.6785216 3.99949,-5.2247356 7.16249,-4.1781366 V 26.156219 c 0.68023,1.24683 1.111371,2.527567 0,4.018291",
    "<w": "M 16.962425,4.5907446 18.682688,2.7465923 16.991986,0.78516738 M 5.6779759,8.4692792 C 6.8848239,5.318578 10.744467,2.519303 18.682688,2.7465923 M 4.4491389,15.270475 c 5.5342499,0.07705 5.5729261,-2.421258 5.5729261,-2.421258 M 21.17097,23.866175 c -1.394935,-0.928821 -6.479371,-3.913866 -7.514956,-5.083708 l -4.2357541,0.04103 c -4.084035,0.03955 -5.535622,-1.625995 -5.156872,-5.126527 2.923246,-0.893468 4.928519,-1.120268 8.0311561,-1.12804 M 11.233437,7.9052514 c 4.709789,2.9071866 6.025511,0.7830608 6.025511,0.7830608 M 21.17097,23.866175 C 20.450694,22.352981 17.619773,17.181147 17.331611,15.645593 L 13.67554,13.506332 C 10.150424,11.443695 9.7597369,9.2691822 11.881805,6.4595555 c 3.709786,0.9175664 5.65331,1.9927897 9.659309,4.4967115 M 5.0339509,23.0594 c 4.110276,-1.077346 3.60914,-2.868558 3.60914,-2.868558 m 10.3666941,10.0908 C 18.29121,27.294033 17.872873,25.929707 16.934148,24.648293 15.705301,24.27071 13.385625,24.088019 12.371499,23.464869 l -2.8118971,1.269858 c -2.846625,1.285543 -4.534626,-0.184306 -4.996709,-2.760494 2.466679,-1.545108 4.184619,-2.295393 7.6981981,-3.195929 M 27.091819,4.2547496 c -1.17199,5.1043746 1.37715,5.7004626 1.37715,5.7004626 M 21.421919,30.14536 V 8.5740012 c 0,-4.6785216 3.99949,-5.2247356 7.16249,-4.1781366 V 26.156219 c 0.68023,1.24683 1.111371,2.527567 0,4.018291",
    "w": "m 5.8290794,15.61546 c 5.5342496,0.07705 5.5729256,-2.421258 5.5729256,-2.421258 M 20.3435,26.230332 C 18.948565,25.301511 15.748823,20.951948 14.713238,19.782106 L 10.8002,19.168482 C 6.7161654,19.208032 5.2645784,17.542487 5.6433284,14.041955 8.5665744,13.148487 11.402005,13.194202 14.088836,13.661583 M 11.33878,7.0489974 c 4.709789,2.907187 6.451645,1.656841 6.451645,1.656841 M 20.193526,22.072049 C 19.47325,20.558855 17.470562,18.293462 17.1824,16.757908 L 13.67554,13.506332 C 10.635452,10.687549 9.9486924,7.8033384 13.20515,5.5094084 c 3.545733,1.677565 6.034718,4.236341 8.284127,7.5026976 m 5.602542,-8.7573556 c -1.17199,5.104374 1.37715,5.700462 1.37715,5.700462 M 21.421919,30.14536 V 8.5740014 c 0,-4.678521 3.99949,-5.224735 7.16249,-4.178136 V 26.156219 c 0.68023,1.24683 1.111371,2.527567 0,4.018291 M 6.0300862,4.9430842 l 0.573855,2.999281 2.860341,-0.358639 M 16.819295,4.8370018 19.165788,3.0929192 17.321438,0.97368702 M 6.6039412,7.9423652 C 9.0412932,3.5029232 12.916703,1.8597844 19.165788,3.0929192",
    "$": "m 15.52125,17.747778 0,6.713071 m 0,2.829478 0,3.507551 m 7.732319,-5.666509 -0.497456,-3.255187 -3.352653,0.705455 m -7.823294,-0.0153 -3.1060829,-0.673453 -0.569776,2.980096 M 22.756116,21.876106 c -1.726547,4.501113 -11.047023,5.946846 -14.2820329,0.01678 M 21.569541,13.407172 h 6.36988 M 9.1562621,9.7103619 4.5237595,3.2356389 M 12.599762,7.0649819 10.021739,0.88153401 M 16.637742,5.8521019 V 0.74150487 M 21.637401,6.9104319 22.779692,0.93375234 M 9.1562621,9.7103619 l 3.4434999,-2.64538 4.03798,-1.21288 4.999659,1.05833 -0.0679,6.4967401 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 H 10.890122 C 9.0915021,16.560022 9.1562621,9.7103619 9.1562621,9.7103619 Z",
    "/": "M 1.5841625,11.435967 3.60506,14.656524 6.6646679,12.419164 M 11.971144,6.7976011 14.399801,4.278162 11.603391,2.0568413 M 3.60506,14.656524 C 3.2004478,9.853921 7.0151582,3.9690721 14.3998,4.2781606 m 11.451451,17.1724374 4.545571,-3.46777 M 14.980542,25.570342 7.9752918,23.096935 M 15.997689,21.807944 7.1194584,16.412083 M 18.218914,18.744148 10.900727,9.6290285 M 22.362845,16.777557 17.622778,6.9818276 m -2.642236,18.5885144 1.017147,-3.762398 2.221225,-3.063796 4.143931,-1.966591 3.488378,4.673063 c 1.281451,1.673814 1.658492,2.968018 1.293089,3.774043 l -6.61826,5.049003 c -1.862761,0.219874 -5.54551,-4.703324 -5.54551,-4.703324 z",
    "%": "m 20.848341,21.091589 v 9.695078 M 10.4149,28.662332 l 3.363907,1.407623 1.07455,-3.078049 m 2.399917,-7.870217 0.361852,-3.480662 -3.57119,-0.02793 m -0.265129,14.456855 c -1.969886,-4.128414 -3.156976,-9.475449 3.836317,-14.428929 m 7.972748,-0.198717 5.406448,-1.693282 M 11.462695,15.682949 3.8173958,11.726187 M 13.734934,12.444982 4.644297,3.8776783 M 17.246628,10.280062 11.983602,0.70743083 M 22.742677,9.8111337 19.801983,0.52312708 M 12.833908,18.064934 c -0.815301,-1.28457 -1.371213,-2.381983 -1.371213,-2.381983 v -2e-6 l 2.272239,-3.237967 3.511694,-2.16492 5.496049,-0.4689263 2.845151,5.6311753 c 1.057216,2.027823 1.142606,3.387859 0.479895,4.031564 l -9.314862,2.565843 C 16.173505,21.93276 15.547616,21.470921 14.936095,20.841153",
    "8": "m 15.30788,22.402663 v 2.012776 m 0,3.491897 v 2.865553 m -5.121128,-13.78808 3.44911,-1.156452 1.295277,3.22261 m 9.255826,-11.4603346 -2.615791,2.4165976 2.551418,2.356573 m -10.48673,3.464554 c -4.6703188,4.690714 0.15843,13.979018 9.051778,10.70414 9.99681,-3.681216 10.981969,-18.4541934 -1.116467,-16.525269 m -3.006138,6.554464 5.191744,-2.394462 M 7.0580042,18.21482 1.3060964,14.419569 M 8.8702052,14.764291 1.640111,7.295102 M 11.705417,12.257847 6.9184562,2.043005 M 16.178197,11.241044 13.993643,1.0420002 M 11.445964,24.013074 C 9.5800342,23.821948 7.0580042,18.21482 7.0580042,18.21482 l 1.812201,-3.450529 2.8352118,-2.506444 4.47278,-1.016803 2.386806,5.320663 c 0.886119,1.912737 0.972222,3.257992 0.440034,3.965079 l -5.035146,2.322238",
    "->": "M 2.758808,12.879031 H 20.519174 V 9.810052 l 9.187464,5.942451 -9.187464,6.404895 V 18.67494 H 2.743431",
    "2": "M 4.362507,5.5708982 C 32.210924,0.42005906 30.076403,14.313962 12.034029,21.449952 h 9.685055 v -2.903097 l 8.398763,5.432319 -8.398763,5.855064 V 26.553157 H 5.7342491 c -0.4497757,0 -0.9412602,-0.129342 -0.9316807,-0.69497 L 4.765156,19.860699 C 30.015745,7.6594678 15.650535,8.7735259 4.2982968,10.7617",
    "3": "m 21.751371,10.96049 c 5.602619,4.334143 1.142382,8.00574 3.63092,10.040144 l 2.784633,-2.093286 0.536048,10.602611 -10.405734,-3.183294 2.881152,-2.165842 C 17.621881,19.42971 21.970266,17.784146 19.812641,15.794175 M 6.7195493,15.44354 C 7.8397631,8.0541536 13.322166,5.6410625 16.034715,7.4532795 c 3.948006,2.6376095 -0.04171,9.8351795 -1.888734,8.1968185 -1.01721,-0.902294 0.556218,-2.782937 2.693478,-2.059334 M 2.7994683,14.423073 C 3.2255745,6.3154245 10.958174,0.56083827 16.974644,3.5707827 c 2.586809,1.2941392 8.133263,7.1278913 1.710624,13.5862573 -4.286399,4.310241 -7.199847,1.733175 -8.009092,0.07469 -1.918924,-3.932676 2.271628,-8.408347 6.904705,-7.8129015",
    // arc
    "())": "M 1.6930876,16.225698 C 7.5230136,10.394312 15.111068,7.3155062 24.35913,13.814304 l 1.83776,-2.457899 3.799654,10.26084 -11.193469,-0.372037 2.085359,-2.789048 C 18.253716,16.405214 10.718832,12.911829 3.7710026,21.985742",
    // circle (included in arc)
    "()": "M 15.519067,28.944736 C -0.46615739,28.306243 -1.5911213,7.6481402 10.495604,3.870944 22.58233,0.09374765 29.430372,10.054779 26.348266,19.474832 l 2.849795,1.138988 -8.927787,6.325885 -2.537723,-10.908351 3.233744,1.292444 C 23.114877,14.493553 20.119018,7.4317505 12.938918,9.2937511 5.7588184,11.155751 5.404769,22.963984 16.623615,23.476055",
}
