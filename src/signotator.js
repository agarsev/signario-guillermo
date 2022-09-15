import { useState } from "react";

import './signotator.css';

let tabComponent = {};

const fixColons = /:(?=:)|^:|:$/g;

export default function Signotator ({ inputRef, updateVal }) {
    const [tab, setTab] = useState("Q");
    const Component = tabComponent[tab];
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
        setTab(Component.nextTab);
    };
    return <div className="Signotator" onClick={e => {
        e.preventDefault(); e.stopPropagation(); inputRef.current.focus();
        }} >
        <nav>{["Q", "O", "L", "D", "R"].map(seg=> <button key={seg}
                disabled={tab==seg} onClick={() => setTab(seg)}>
            {seg}</button>)}</nav>
        <Component done={appendSN} />
    </div>;
}

const fingers = {
    I: "m 21.528411,24.731809 h -5.27179 m 5.33961,-5.96757 V 4.6388 m -12.560944,16.845735 2.971263,-2.811166 4.45726,-1.112567 5.132421,1.203438 -0.06782,5.96757 c 0.004,2.34864 -0.5366,3.74983 -1.40496,4.21688 h -9.27442 C 9.050417,27.88466 9.035287,21.484535 9.035287,21.484535 Z",
    V: "m 21.188354,24.73181 h -5.27179 M 16.596651,17.17674 15.511855,3.473968 M 21.002438,18.137395 23.86837,4.609805 M 8.823155,21.59666 l 3.149906,-3.282582 4.62359,-1.137338 4.405787,0.960655 0.185876,6.594415 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 h -9.27442 C 8.710314,27.88466 8.823155,21.59666 8.823155,21.59666 Z",
    C: "m 21.528411,24.731809 h -5.27179 m -0.0981,-7.55507 V 3.0512988 M 9.1151711,21.03501 l 3.0783899,-2.645381 3.96496,-1.21289 5.43779,1.642504 -0.0679,5.912566 c 0.004,2.34864 -0.5366,3.74983 -1.40496,4.216881 h -9.27442 C 9.0504111,27.884659 9.1151711,21.03501 9.1151711,21.03501 Z",
    B: "m 21.528451,24.731806 h -5.27179 m -7.14149,-3.696802 -5.0135,-6.925011 m 8.457,4.279629 -4.8493,-12.30609 m 8.88728,11.093205 V 3.051296 m 4.99966,15.18377 2.50953,-13.184991 m -14.99067,15.984929 3.4435,-2.645382 4.03798,-1.212885 4.99966,1.058333 -0.0679,6.496736 c 0.004,2.348638 -0.5366,3.749831 -1.40496,4.216884 h -9.27442 c -1.79862,-1.06403 -1.73386,-7.913686 -1.73386,-7.913686 z",
    P: "m 21.188314,24.73181 h 5.16386 m -17.8231,-3.63434 3.259661,-2.87455 5.317869,-0.73937 4.22432,1.48106 -0.14261,5.7672 c 0.004,2.34864 -0.5366,3.74983 -1.40496,4.21688 h -9.27442 c -1.79862,-1.06403 -1.97986,-7.85122 -1.97986,-7.85122 z",
    M: "M 21.528455,24.73181 H 15.926378 M 9.115177,21.035 4.101675,14.10999 m 5.013502,6.92501 3.443499,-2.64538 4.444216,-0.81019 4.541179,1.46307 -0.01566,5.68931 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 H 10.849036 C 9.050417,27.88466 9.115177,21.035 9.115177,21.035 Z",
    OO: "m 21.528451,24.73181 h 6.36988 M 9.1151711,21.035 4.1016691,14.10999 M 12.558671,18.38962 7.7093711,6.08354 m 8.8872799,11.0932 V 3.05131 m 4.99966,15.18376 2.50953,-13.18499 M 9.1151711,21.035 l 3.4434999,-2.64538 4.03798,-1.21288 4.99966,1.05833 -0.0679,6.49674 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 h -9.27442 C 9.0504111,27.88466 9.1151711,21.035 9.1151711,21.035 Z",
    "#": "m 21.188314,24.73181 h -5.27179 m -7.38745,-3.63434 3.25966,-2.87455 5.31787,-0.73937 4.22432,1.48106 -0.14261,5.7672 c 0.004,2.34864 -0.5366,3.74983 -1.40496,4.21688 h -9.27442 c -1.79862,-1.06403 -1.97986,-7.85122 -1.97986,-7.85122 z",
    L: "m 21.528455,24.73181 h 6.65515 m -6.58733,-5.4384 V 5.167967 m -12.56094,16.845743 2.97126,-2.81117 4.45726,-1.11257 5.13242,1.20344 -0.0678,5.96757 c 0.004,2.34864 -0.5366,3.74983 -1.40496,4.21688 h -9.27442 c -1.79862,-1.06403 -1.81374,-7.46415 -1.81374,-7.46415 z",
    IM: "m 21.52841,24.73181 h -5.271789 m 5.33961,-5.96757 V 4.638798 M 9.035286,21.48454 l 2.971264,-2.81117 4.45726,-1.11257 5.132421,1.20344 -0.06782,5.96757 c 0.004,2.34864 -0.5366,3.74983 -1.40496,4.21688 h -9.27442 C 9.050411,27.88466 9.035286,21.48454 9.035286,21.48454 Z m 0,0 -5.013499,-6.92501",
    H: "m 21.528451,24.20264 h 6.74399 M 16.678581,17.17673 15.134331,3.52559 m 6.25983,14.92161 3.11858,-13.5011 M 9.1632495,21.59666 12.31316,18.31407 l 4.365421,-1.13734 4.71558,1.27047 0.13425,6.28461 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 H 10.84903 C 9.0504095,27.88466 9.1632495,21.59666 9.1632495,21.59666 Z",
    W: "M 12.349661,18.27757 7.733641,5.77329 m 13.7948,18.73945 h -5.27179 m 0.27588,-7.336 0.0115,-14.22752 m 4.79851,15.18818 2.86593,-13.52759 m -15.04522,16.98685 3.18642,-3.31909 4.18287,-1.10083 4.81,0.96066 0.18587,6.59441 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 h -9.27442 c -1.79862,-1.06403 -1.68578,-7.35203 -1.68578,-7.35203 z",
    PM: "m 21.528519,24.73181 h 6.417351 m -18.8306299,-3.16764 -5.0135,-6.92501 m 5.0135,6.92501 3.4434999,-2.64538 4.444216,-0.81019 4.541179,1.46307 -0.01566,5.68931 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 H 10.8491 C 9.0504801,28.41383 9.1152401,21.56417 9.1152401,21.56417 Z",
    PC: "m 21.528475,25.26098 h 6.528179 M 16.158585,17.70591 V 3.58047 m -7.04335,17.98371 3.07839,-2.64538 3.96496,-1.21289 5.43779,1.6425 -0.0679,5.91257 c 0.004,2.34864 -0.5366,3.74983 -1.40496,4.21688 h -9.27442 c -1.79862,-1.06403 -1.73386,-7.91368 -1.73386,-7.91368 z",
    CA: "M 12.282365,18.55643 10.480215,4.99679 m 11.04826,20.04512 h -5.27179 m 0.75632,-7.21744 -0.46894,-14.34608 m -7.4625611,18.26593 3.2008711,-3.18789 4.73064,-0.73196 4.49436,1.27819 0.0211,6.15832 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 h -9.27442 C 9.0504739,28.41383 9.0815339,21.74432 9.0815339,21.74432 Z",
    E: "m 27.726152,4.016506 c -1.17199,5.104375 1.37715,5.700463 1.37715,5.700463 m -7.04705,18.443028 V 8.335758 c 0,-4.678522 3.99949,-5.224736 7.16249,-4.178137 v 20.013235 c 0.68023,1.24683 1.11137,2.527567 0,4.018291",
    r: "m 2.9259217,23.173801 c 5.10438,1.17199 5.70046,-1.37715 5.70046,-1.37715 M 21.235122,28.429729 H 7.2451717 c -4.67852,0 -5.22473,-3.585518 -4.17813,-6.748508 H 23.080272 c 4.1765,-0.926525 8.12964,1.615055 6.13847,6.507926",
    c: "m 7.8389319,14.822501 c 5.2371601,-0.018 5.2327201,-2.382255 5.2327201,-2.382255 m 8.9846,15.719751 c 0.13189,-3.906077 0.085,-5.718536 -0.60731,-7.59455 -1.33499,-0.855839 -4.02985,-1.81894 -5.02882,-2.908704 l -3.75855,0.668165 C 8.8566019,19.001325 7.3365119,16.654915 7.6373519,13.336877 11.076662,12.220046 13.364542,11.843264 17.834682,11.852998 c 2.64325,0.123336 7.24844,2.108393 8.26336,4.000197 2.28764,2.964743 3.66768,8.064493 3.12071,12.335952",
    g: "m 14.484612,21.895343 c 2.45316,-4.627114 -0.0332,-6.580928 -0.0332,-6.580928 m 7.50726,12.45528 0.29273,-10.337049 -1.32678,-0.03954 -0.81337,1.74063 c -1.63116,3.490739 -5.23236,3.910918 -7.42316,2.06709 l 2.89739,-8.060809 c 0.61323,-2.011723 2.81753,-1.932408 2.81753,-1.932408 l 8.76422,0.173716 c 0,0 2.1462,0.111861 2.05151,2.366471 v 10.42306 c 0.68023,1.24683 1.11137,2.527573 0,4.018295",
    "-": "m 23.747558,14.131607 h 4.351861 m -2.735887,1.876019 -1.615974,-1.876019 1.612254,-1.875018 M 6.8515098,14.131607 H 2.4996487 m 2.7358868,1.876018 1.6159743,-1.876018 -1.612254,-1.875019 M 21.665695,24.820549 h 6.36988 m -18.7831603,-3.69681 0.1900955,-9.49296 m 3.4258968,6.84758 -0.01704,-13.3662656 M 17.009883,17.265479 V 3.1400494 M 21.595561,18.323809 21.047814,5.1087444 M 9.2524149,21.123739 l 3.6159921,-2.64538 4.141476,-1.21288 4.585678,1.05833 0.07009,6.49674 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 h -9.274416 c -1.7986203,-1.06403 -1.7338603,-7.91369 -1.7338601,-7.91369 z",
    "+": "m 2.6421692,20.140237 c 4.729821,0.572425 3.725537,3.129823 3.725537,3.129823 M 19.72991,22.986113 c -1.674703,-1.899065 -4.08688,-3.956243 -7.102425,-4.712234 -3.9568278,-0.991968 -8.1346168,-1.120392 -9.2531818,0.09617 -1.118564,1.21656 -1.039974,4.052473 -1.039974,4.052473 l 5.903536,1.472267 c 0.608186,0.455094 0.940848,1.052286 2.1196298,1.213104 1.382207,0.8618 2.659967,1.775527 2.879529,3.215346 M 5.7822502,25.660364 v 4.351861 m -1.876019,-2.735887 1.876019,-1.615974 1.875018,1.612254 M 5.7822502,6.7643171 v -4.351861 m -1.876018,2.735887 1.876018,1.615974 1.875019,-1.612254 m -4.60312,5.8807869 c 5.104381,1.17199 5.70046,-1.3771489 5.70046,-1.3771489 M 21.753657,15.943793 H 7.3733992 c -4.67852,0 -5.22473,-3.240533 -4.17813,-6.4035219 H 23.598807 c 3.809067,-0.3692698 6.656722,0.8867819 6.865962,4.1409209",
    O: "m 19.508495,25.322512 h 7.443186 m -3.721593,-3.997496 v 7.994993 M 9.7853375,20.85842 4.7718275,13.93341 M 13.228837,18.21304 8.3795375,5.9069623 M 17.266817,17.00016 V 2.8747323 M 16.788405,28.77211 H 11.519197 C 9.7205775,27.70808 9.7853375,20.85842 9.7853375,20.85842 l 3.4434995,-2.64538 4.03798,-1.21288 4.99966,1.05833",
    D: "m 9.5312443,20.603456 2.9210597,4.495827 m 4.50744,-8.41956 c -0.55159,1.90606 -1.34731,3.092182 -1.21719,7.008665 m -3.24007,-5.896098 c -0.0912,2.321192 -0.39396,3.723156 1.54435,6.395408 m 7.602818,1.333469 c -2.210168,0.676253 -4.146378,1.147311 -6.416948,-0.567038 M 22.092163,17.88316 V 3.7577202 M 11.344984,28.067611 C 9.5463743,27.003581 9.5312443,20.603456 9.5312443,20.603456 h -2e-5 c 0.6350697,-1.281379 1.6801697,-2.036854 2.9712597,-2.811166 1.29109,-0.774312 2.96228,-1.05446 4.45726,-1.112567 1.61585,-0.0628 3.396131,0.676678 5.132419,1.203438 l -0.0678,5.96757 c 0.004,2.34864 -0.5366,3.74983 -1.40496,4.21688 M 11.725184,6.5895262 v 6.9280978 c 1.91354,0 5.48194,0.475944 5.48194,-3.365559 0,-4.0779328 -3.81128,-3.5625388 -5.48194,-3.5625388 z",
    T: "m 20.837897,22.912268 5.284986,-5.716827 m -17.6982676,4.020016 -5.0135,-6.925009 M 11.868115,18.570077 7.0188154,6.2639973 M 15.975095,17.357198 V 3.2317673 m 4.189422,15.2327287 2.038623,0.751857 m 2.945872,1.086457 4.122594,1.52044 M 10.158475,29.129147 C 8.3598554,28.065117 8.4246154,21.215456 8.4246154,21.215456 l 3.4434996,-2.64538 4.10698,-1.21288 4.189422,1.107299 0.67334,6.447772 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 m -4.464342,-7.421401 v 6.855514 m -3.17538,-6.873219 h 6.35076",
    F: "m 20.837897,22.912268 1.896091,-2.051022 m 1.990297,-2.152926 1.398598,-1.512878 m -17.6982676,4.020016 -5.0135,-6.92501 M 11.868115,18.570078 7.0188154,6.2639973 M 15.975095,17.357198 V 3.2317673 m 4.189422,15.2327287 9.107089,3.358754 m -19.113131,7.305897 c -1.7986196,-1.06403 -1.7338596,-7.91369 -1.7338596,-7.91369 l 3.4434996,-2.64538 4.10698,-1.21288 4.189422,1.107298 0.67334,6.447772 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 m -5.988342,-4.444963 h 3.2842 m 0.45247,-3.23263 h -3.81041 v 7.164184",
    R: "M 16.468213,16.203565 21.756182,3.7547803 M 21.805491,17.333364 16.966023,3.2492526 M 10.332446,28.770474 C 8.4123667,27.63459 8.4815,20.322373 8.4815,20.322373 l 3.676038,-2.824022 4.310664,-1.294786 5.337289,1.129799 -0.07249,6.935464 c 0.0043,2.507233 -0.572836,4.003056 -1.499836,4.501646 m -6.948514,-1.123776 v -7.607246 c 1.400249,0 4.127263,-0.186345 4.127263,1.712403 0.0085,1.96952 -1.326694,2.095401 -4.107097,2.140374 2.586319,0.09668 3.814172,1.344046 4.702345,3.660594",
    S: "m 20.837897,22.912268 8.099483,-3.832942 m -20.5127646,2.136132 -5.0135,-6.92501 M 11.868115,18.570078 7.0188154,6.2639973 M 15.975095,17.357198 V 3.2317673 M 20.06102,18.15401 c 2.073092,-2.862483 4.387203,-3.036157 4.249004,2.991997 m -14.151549,7.98314 c -1.7986196,-1.06403 -1.7338596,-7.91369 -1.7338596,-7.91369 l 3.4434996,-2.64538 4.10698,-1.21288 4.085925,0.796812 0.776837,6.758258 c 0.004,2.34863 -0.5366,3.74983 -1.40496,4.21688 m -2.127522,-7.819578 c -3.43905,-0.942369 -4.85961,0.295841 -4.73183,1.593915 0.23227,2.359516 4.76409,0.343763 4.79016,3.195652 0.0184,2.008766 -2.13369,2.278271 -4.65031,1.592365",
    LL: "m 16.467611,26.351082 c 0,0.895186 -0.725692,1.620877 -1.620878,1.620877 -0.895186,0 -1.620877,-0.725691 -1.620877,-1.620877 0,-0.895185 0.725691,-1.620877 1.620877,-1.620877 0.895186,0 1.620878,0.725692 1.620878,1.620877 z M 15.045503,20.11376 h 2.018556 m 0.793696,-1.910465 H 14.88148 l -0.03474,6.52691 m 7.154243,-3.505863 3.072193,-9.713926 M 21.534721,15.86461 21.815014,6.2427351 C 21.988187,2.14396 27.073667,3.7109008 25.592314,8.782881 M 9.8508005,27.898211 C 7.8305794,26.703087 7.9033183,19.009508 7.9033183,19.009508 l 3.8677587,-2.971307 4.535484,-1.362314 5.228158,1.188723 0.311223,7.297177 c 0.0045,2.637995 -0.602713,4.211831 -1.57806,4.736424",
};

tabComponent.Q = function ({ done }) {
    const [picam, setPicam] = useState(null);
    const [flex, setFlex] = useState("");
    const [touch, setTouch] = useState("");
    const [others, setOthers] = useState(false);
    function reset() { setPicam(null); setFlex(""); setTouch(""); setOthers(false); }
    function finish() {
        done(`:${flex===""?picam.toUpperCase():picam}${flex!=="c"?flex:""}${touch}${others?"O":""}:`);
    }

    function FingerDrawing ({ name }) {
        if (fingers[name]) {
            return <svg style={{ width: "100%", padding: 0,
                    fill: "none", strokeWidth: 1.25,
                    strokeLinecap: "round", strokeLinejoin: "round"
                }} viewBox="0 0 32 32">
                <path d={fingers[name]} />
            </svg>;
        } else return name;
    }

    function SelButton ({ opts }) { // current picam, value to set, display, holistic set r+O
        const choice = opts.find(o => (o[0] == picam || o[1] == picam)) || opts[0];
        const holi = choice[3];
        const actual = holi ?
            picam == choice[1] && flex == holi[0] && touch == holi[1] && others == holi[2] :
            picam == choice[1];
        return <button disabled={holi===undefined && !actual && picam !== null && picam !== choice[0]}
            className={actual?"actual":""}
            onClick={() => {
                if (actual) reset();
                else {
                    setPicam(choice[1]);
                    if (choice[3]) {
                        setFlex(choice[3][0]);
                        setTouch(choice[3][1]);
                        setOthers(choice[3][2]);
                    }
                }
            }}><FingerDrawing name={choice[2]} /></button>;
    }

    function ToggleButton ({ enabled, actual, onClick, display }) {
        return <button disabled={!enabled} className={actual?"actual":""}
            onClick={actual?reset:onClick}>
            <FingerDrawing name={display} /></button>;
    }

    return <div><table>
        <tbody>
            <tr><td>
                <SelButton opts={[[null, "i", "I"],
                          ["p", "pi", "L"],
                          ["m", "im", "IM"]]} />
            </td><td>
                <SelButton opts={[[null, "ic", "V"],
                                  ["p", "pic", "H"]]} />
            </td><td>
                <SelButton opts={[[null, "c", "C"],
                                  ["ic", "ica", "W"],
                                  ["p", "pc", "PC"]]} />
            </td><td className="!border-b">
                <SelButton opts={[[null, "icam", "B"],
                                  ["c", "ca", "CA"]]} />
            </td></tr>

            <tr><td>
                <SelButton opts={[[null, "p", "P"],
                                  ["i", "pi", "L"],
                                  ["ic", "pic", "H"],
                                  ["c", "pc", "PC"],
                                  ["m", "pm", "PM"]]} />
            </td><td>
                <SelButton opts={[[null, "m", "M"],
                                  ["p", "pm", "PM"],
                                  ["i", "im", "IM"]]} />
            </td><td>
                <SelButton opts={[[null, "picam", "OO"]]} />
            </td><td className="!border-l">
                <SelButton opts={[[null, "picam", "#", ["#", "", false]]]} />
            </td></tr>

            <tr><td className="!border-y">
                <ToggleButton enabled={true} actual={flex==""} display="E"
                    onClick={() => setFlex("")} />
            </td><td className="!border-y">
                <ToggleButton enabled={true} actual={flex=="c"} display="c"
                    onClick={() => setFlex("c")} />
            </td><td className="!border-y">
                <ToggleButton enabled={true} actual={flex=="r"} display="r"
                    onClick={() => setFlex("r")} />
            </td><td className="!border-b">
                <ToggleButton enabled={true} actual={flex=="g"} display="g"
                    onClick={() => setFlex("g")} />
            </td></tr>

            <tr><td>
                <SelButton opts={[[null, "pcam", "D", ["c", "+", true]], //pcam+O
                                  ["pi", "ip", "T", ["r", "", true]],   // iprO
                                  ["ic", "ci", "R", ["", "", false]]]} />
            </td><td className="!border-l !border-b">
                <ToggleButton enabled={["ic", "ica", "icam", "pi", "pic", "picam"].includes(picam)}
                    actual={touch=="-"} display="-"
                    onClick={() => setTouch("-")} />
            </td><td className="!border-r !border-b">
                <ToggleButton enabled={picam?.startsWith("p") && ["c", "r", "g"].includes(flex)}
                    actual={touch=="+"} display="+"
                    onClick={() => setTouch("+")} />
            </td><td className="!border-b">
                <ToggleButton enabled={picam?.length<5}
                    actual={others} display="O"
                    onClick={() => setOthers(!others)} />
            </td></tr>

            <tr><td>
                <SelButton opts={[[null, "pi", "F", ["r", "-", true]]]} />
            </td><td>
                <SelButton opts={[[null, "pi", "S", ["c", "-", true]]]} />
            </td><td>
                <SelButton opts={[[null, "pi", "LL", ["g", "+", false]]]} />
            </td><td className="!border-l">
                <button className="finish" disabled={picam===null} onClick={finish}>✔</button>
            </td></tr>
        </tbody>
    </table></div>;
}

tabComponent.Q.nextTab = "O";

tabComponent.O = function ({ done }) {
    const [palmar, setPalmar] = useState([]);
    const [distal, setDistal] = useState([]);
    return <div><table>
        <tbody>
            <tr><th>Palma</th><th>Dedos</th></tr>
            <tr><td>
                <Direction val={palmar} set={setPalmar} />
            </td><td>
                <Direction val={distal} set={setDistal} />
            </td></tr>
            <tr><td colSpan="2" className="text-right"><button className="finish"
                disabled={palmar.length==0 && distal.length==0}
                onClick={() => done(`:${palmar.join('')}${distal.join('').toLowerCase()}:`)}>✔</button>
            </td></tr>
        </tbody>
    </table></div>;
}

tabComponent.O.nextTab = "Q";

function Direction ({ val, set }) {
    function Arrow({ dir, opo, path }) {
        let cn = "Arrow";
        let click = null;
        if (val.includes(dir)) {
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
        <Arrow dir="F" opo="B" path="m 133.66599,62.189793 -16.63545,6.86199 8.18301,0.0785 -5.84265,8.538184 7.35789,0.07058 5.84265,-8.538184 8.18299,0.0785 z" />
        <Arrow dir="H" opo="L" path="m 120.15121,52.244762 -9.71724,10.715056 h 6.70347 v 13.114959 h 6.02754 V 62.959818 h 6.70346 z" />
        <Arrow dir="X" opo="Y" path="m 91.006791,81.042921 5.856436,7.820849 3.351733,-5.395239 h 13.11496 l 3.01377,-4.851221 h -13.11496 l 3.35173,-5.395231 z" />
        <Arrow dir="Y" opo="X" path="m 150.49164,81.125927 -5.85643,-7.820849 -3.35174,5.395239 h -13.11496 l -3.01377,4.851221 h 13.11496 l -3.35173,5.395231 z" />
        <Arrow dir="L" opo="H" path="m 121.34719,109.92412 9.71724,-10.715056 h -6.70347 V 86.094105 h -6.02754 v 13.114959 h -6.70346 z" />
        <Arrow dir="B" opo="F" path="m 107.83243,99.97909 16.63545,-6.86199 -8.18301,-0.0785 5.84265,-8.538184 -7.35789,-0.07059 -5.84264,8.538184 -8.183,-0.0785 z" />
    </svg>;
}
