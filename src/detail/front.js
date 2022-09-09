import { createRoot } from "react-dom/client";

function DetailFront () {
    return <p>Hello Detail</p>;
}

createRoot(document.getElementById("appRoot")).render(<DetailFront />);
