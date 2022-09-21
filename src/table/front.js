import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

function useTable () {

    const [ isLoading, setIsLoading ] = useState(true);
    const [ rows, setRows ] = useState([]);
    const [ page, setPage ] = useState(0);
    const [ numPages, setNumPages ] = useState(0);

    const load = () => {
        const { rows, numPages } = back.select(page);
        setRows(rows);
        setNumPages(numPages);
        setIsLoading(false);
    }

    useEffect(() => {
        load();
        const listener = window.addEventListener("focus", load);
        return () => window.removeEventListener("focus", load);
    }, [page]);

    return { isLoading, rows, page, numPages,
        next: page<(numPages-1)?() => setPage(page+1):false,
        prev: page>0?() => setPage(page-1):false,
    };
}

function App () {
    const table = useTable();
    return <>
        <h1 className="text-primary-800">Guillermo</h1>
        <nav>
            Página:
            <button onClick={table.prev?table.prev:undefined} disabled={!table.prev}>-</button>
            {table.page+1}/{table.numPages}
            <button onClick={table.next?table.next:undefined} disabled={!table.next}>+</button>
        </nav>
        <table className="border-primary-200">
            <thead>
                <tr>
                    <th></th>
                    <th>Glosa</th>
                    <th>Signotación</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {table.isLoading?<tr>
                    <td colSpan="4">Cargando...</td>
                </tr>:table.rows.map(r => <tr key={r.number}>
                    <td className="text-sm text-gray-600">{r.number}</td>
                    <td>{r.gloss}</td>
                    <td>{r.notation}</td>
                    <td><button onClick={() => back.openDetail(r.number)}>!</button></td>
                </tr>)}
            </tbody>
        </table>
    </>;
}

createRoot(document.getElementById("appRoot")).render(<App />);
