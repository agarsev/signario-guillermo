import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

function useTable () {
    const [ isLoading, setIsLoading ] = useState(true);
    const [ rows, setRows ] = useState([]);
    useEffect(() => {
        const rows = back.select();
        setRows(rows);
        setIsLoading(false);
    }, []);
    return { isLoading, rows };
}

function App () {
    const table = useTable();
    return <>
        <h1 className="text-primary-800">Guillermo</h1>
        <table className="border-primary-200">
            <thead>
                <tr>
                    <th>Número</th>
                    <th>Glosa</th>
                    <th>Signotación</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {table.isLoading?<tr>
                    <td colSpan="4">Cargando...</td>
                </tr>:table.rows.map(r => <tr>
                    <td>{r.number}</td>
                    <td>{r.gloss}</td>
                    <td>{r.notation}</td>
                    <td></td>
                </tr>)}
            </tbody>
        </table>
    </>;
}

createRoot(document.getElementById("appRoot")).render(<App />);
