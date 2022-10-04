import { createRoot } from "react-dom/client";
import { useState, useEffect, useRef } from "react";

import { debounce } from '../common/front.js';
import Signotator from '../signotator/main.js';

const saveDB = debounce(600);
const msgDB = debounce(3500);
const saveMSG = {
    0: "", // Pristine
    1: "", // Careful! NBSP (\u00A0)
    2: "Cambios sin guardar",
    3: "Todo guardado 👍"
};
let original_info = null;

const urlParams = (new URL(document.location)).searchParams;
const number = urlParams.get('number');
const video_dir = urlParams.get('video_dir');
const user_name = urlParams.get('user_name') || 'anon';

createRoot(document.getElementById("appRoot")).render(<DetailFront />);

function DetailFront () {
    const [ info, setInfo ] = useState(null);
    const [ saveStatus, setSS ] = useState(0);
    useEffect(() => {
        (async () => {
            const got_info = await back.select(number);
            setInfo(got_info);
            original_info = got_info;
        })();
    }, []);
    const updInfo = (upd, keep_name) => {
        if (!keep_name) upd.modified_by = user_name;
        setInfo({...info, ...upd});
        setSS(2);
        msgDB.clear();
        saveDB.run(async () => {
            setInfo(await back.update(number, upd));
            setSS(3);
            msgDB.run(() => setSS(1));
        });
    };

    const [ tab, setTab ] = useState("info");
    function NavButton ({ name, code }) {
        const cur = code == tab;
        return <button className="p-2"
            onClick={cur?null:() => setTab(code)}
            disabled={cur}>{name}</button>;
    }

    let theTab;
    if (tab == "info" && info != null) {
        theTab = <Info update={updInfo} saveStatus={saveStatus}
            reset={() => updInfo(original_info, true)} {...info} />;
    } else if (tab == "signot") {
        theTab = <ParamTab update={updInfo} {...info} />;
    } else { theTab = <div></div>; }

    return <div className="grid grid-flow-dense auto-cols-fr grid-rows-[auto,auto,1fr] md:grid-rows-[auto,1fr]">
        <div className="mt-3 md:row-span-2 md:col-start-2 bg-gray-300"><VideoPlay /></div>
        <nav className="mt-3 space-x-1">
            <NavButton name="Metadatos" code="info" />
            <NavButton name="Signotación" code="signot" />
            <NavButton name="Acepciones" code="lexic" />
        </nav>
        <div className="p-2">{theTab}</div>
    </div>;
}

function VideoPlay () {
    const video_src = `${video_dir}/${number.substring(0,3)}/${number.substring(3)}.mp4`;
    return <video className="cursor-pointer" muted autoPlay controls >
        <source src={video_src} />
    </video>;
}

function Info ({ gloss, update, reset, modified_by, modified_at, saveStatus }) {
    return <ul className="space-y-1">
        <li>Número: {number}</li>
        <li className="text-lg border-t border-primary-600 pt-1">Glosa:</li>
        <li className="text-lg border-b border-primary-600 pb-2">
            <input className="p-1 w-full" type="text" value={gloss}
                onChange={e => update({gloss: e.target.value})} />
        </li>
        <li>Entrada por <i>{modified_by}</i> el <i>{modified_at}</i></li>
        <li><button className="pill" disabled={saveStatus==0} onClick={reset}>Revertir todos los cambios</button></li>
        <li className="ml-2 italic text-sm text-gray-800">{saveStatus>1?saveMSG[saveStatus]:" "}</li>
    </ul>;
}

function ParamTab ({ notation, update }) {
    const notationInput = useRef();
    return <>
        <input className="text-lg p-1 mt-1 mb-3 w-full" type="text"
            value={notation || ""} ref={notationInput}
            onChange={e => update({notation: e.target.value})} />
        <Signotator inputRef={notationInput} updateVal={notation => update({notation})} />
    </>;
}
