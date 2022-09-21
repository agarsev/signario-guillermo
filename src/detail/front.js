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

createRoot(document.getElementById("appRoot")).render(<DetailFront />);

function DetailFront () {
    const [ info, setInfo ] = useState(null);
    const [ saveStatus, setSS ] = useState(0);
    useEffect(() => {
        const got_info = back.select(number);
        setInfo(got_info);
        original_info = got_info;
    }, [number]);
    const updInfo = upd => {
        setInfo({...info, ...upd});
        setSS(2);
        msgDB.clear();
        saveDB.run(() => {
            setInfo(back.update(number, upd));
            setSS(3);
            msgDB.run(() => setSS(1));
        });
    };

    return <>
        <header className="p-2 grid grid-cols-1 md:grid-cols-2 gap-2">
            {info!==null ?
                <Info update={updInfo} saveStatus={saveStatus}
                    reset={() => updInfo(original_info)} {...info} /> :
                <div></div>}
            <VideoPlay />
        </header>
        <nav className="space-x-1">
            <button className="p-2" disabled>Signotación</button>
            <button className="p-2">Información Léxica</button>
        </nav>
        <div className="p-2">
            <ParamTab update={updInfo} {...info} />
        </div>
    </>;
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
