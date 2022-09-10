import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

const urlParams = (new URL(document.location)).searchParams;
const number = urlParams.get('number');
const video_dir = urlParams.get('video_dir');

createRoot(document.getElementById("appRoot")).render(<DetailFront />);

function DetailFront () {
    const [ info, setInfo ] = useState(null);
    useEffect(() => {
        setInfo(back.select(number));
    }, [number]);

    return <>
        <header>
            Vídeo: {number}
            <VideoPlay />
        </header>
        {info!==null?<Info {...info} />:null}
    </>;
}

function VideoPlay () {
    const video_src = `${video_dir}/${number.substring(0,3)}/${number.substring(3)}.mp4`;
    return <video muted autoPlay>
        <source src={video_src} />
    </video>;
}

function Info ({ gloss, notation }) {
    return <table><tbody>
        <tr><th>Glosa:</th><td>{gloss}</td></tr>
        <tr><th>Signotación:</th><td>{notation}</td></tr>
    </tbody></table>;
}
