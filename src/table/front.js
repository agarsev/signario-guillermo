import { createRoot } from "react-dom/client";
import { useState, useEffect } from "react";

function useTable () {

    const [ isLoading, setIsLoading ] = useState(true);
    const [ rows, setRows ] = useState([]);
    const [ page, setPage ] = useState(0);
    const [ numPages, setNumPages ] = useState(1);

    const load = async () => {
        try {
            const { rows, numPages } = await back.select(page);
            setRows(rows);
            setNumPages(numPages);
            setIsLoading(false);
        } catch {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
        const listener = window.addEventListener("focus", load);
        return () => window.removeEventListener("focus", load);
    }, [page]);

    return { isLoading, rows, page, numPages, goto: setPage };
}

const MAX_TABS = 15;
function App () {
    const table = useTable();
    return <>
        <header>
            <h1 className="text-primary-800">Guillermo</h1>
        </header>
        <nav>
            <span className="h-8 py-1 mr-1">Página:</span>
            {Array(table.numPages).fill().map((_, i) => {
                const cur = i==table.page;
                let dist = Math.abs(i-table.page);
                if (i==0 || i==table.numPages-1) dist=0;
                else if (dist>MAX_TABS) dist=MAX_TABS;
                dist = dist/(MAX_TABS*1.1);
                dist = 100 * (dist*dist);
                return <span key={i} className={`${dist<3?"min-w-[2em] basis-auto":"min-w-[3px] basis-0"} max-w-[4em] shrink ${dist<MAX_TABS?"px-[2px]":""}`}
                    style={{flexGrow: 100-dist, transition:"flex-grow 200ms"}}>
                    <button className="w-full h-8 break-all overflow-hidden" disabled={cur}
                        onClick={cur?()=>{}:() => table.goto(i)}>{` ${i+1} `}</button>
                </span>;
            })}
        </nav>
        <div className="overflow-y-auto">
            <SignTable table={table} />
        </div>
    </>;
}

function SignTable ({ table }) {
    return <table className="SignTable">
        <thead>
            <tr>
                <th></th>
                <th>Glosa</th>
                <th>Signotación</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {table.rows.length>0?
                table.rows.map(r => <tr className="group" key={r.number}>
                    <td className="text-sm text-secondary-800/80 group-hover:text-primary-700">{r.number}</td>
                    <td>{r.gloss}</td>
                    <td>{r.notation}</td>
                    <td>
                        <button onClick={() => back.openDetail(r.number, true)}>!</button>
                        <button onClick={() => back.openDetail(r.number, false)}>+</button>
                    </td>
                </tr>):
                <tr>
                    <td colSpan="4" className="text-secondary-800 italic px-4 py-1">{table.isLoading?"Cargando...":"No hay resultados"}</td>
                </tr>
            }
        </tbody>
    </table>;
}

createRoot(document.getElementById("appRoot")).render(<App />);
