import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

import { debounce } from '../common/front.js';

const saveDB = debounce(600);
const msgDB = debounce(3500);
const saveMSG = {
    0: "",
    1: "Cambios sin guardar",
    2: "Todo guardado 👍"
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
        setSS(1);
        msgDB.clear();
        saveDB.run(() => {
            setInfo(back.update(number, upd));
            setSS(2);
            msgDB.run(() => setSS(0));
        });
    };

    return <>
        <header>
            Vídeo: {number}
            <VideoPlay />
        </header>
        <button onClick={() => updInfo(original_info)}>Revertir todos los cambios</button>
        <span class="ml-2 italic text-sm text-gray-800">{saveMSG[saveStatus]}</span>
        {info!==null?<Info update={updInfo} {...info} />:null}
    </>;
}

function VideoPlay () {
    const video_src = `${video_dir}/${number.substring(0,3)}/${number.substring(3)}.mp4`;
    return <video muted autoPlay>
        <source src={video_src} />
    </video>;
}

function Info ({ gloss, notation, update, modified_by, modified_at }) {
    return <table><tbody>
        <tr><td colSpan="2">Entrada por {modified_by} el {modified_at}</td></tr>
        <tr><th>Glosa:</th>
            <td><input type="text" value={gloss}
                onChange={e => update({gloss: e.target.value})} /></td>
        </tr>
        <tr><th>Signotación:</th>
            <td><input type="text" value={notation}
                onChange={e => update({notation: e.target.value})} /></td>
        </tr>
    </tbody></table>;
}
