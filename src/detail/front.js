import { createRoot } from "react-dom/client";

const urlParams = (new URL(document.location)).searchParams;
const number = urlParams.get('number');
const video_dir = urlParams.get('video_dir');

function DetailFront () {
    return <>
        <header>
            Vídeo: {number}
            <VideoPlay />
        </header>
    </>;
}

function VideoPlay () {
    const video_src = `${video_dir}/${number.substring(0,3)}/${number.substring(3)}.mp4`;
    return <video muted autoPlay>
        <source src={video_src} />
    </video>;
}

createRoot(document.getElementById("appRoot")).render(<DetailFront />);
