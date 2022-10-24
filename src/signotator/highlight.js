const Q = "_?[PpIiCcAaMm]+[-rg#+O]*";
const O = "[HhLlFfBbXxYx]+";

const grammar = [
    [ `(${Q}):(${O})`, r => [["q", r[1]], ["sep", ":"], ["o", r[2]]] ],
    [ "[A-Z][a-z]{2}[HLFBXY]*", "l" ],
    [ "[HLFBXY]+(?![hlfbxy])", "l" ],
    [ Q, "q" ],
    [ O, "o" ],
    [ "[*]", "c" ],
    [ "[=~&]", "sym" ],
    [ "[RN!]", "dyn" ],
    [ "[[\\]]", "h2" ],
    [ "[: ]", "sep" ],
    [ "[^: *]+" ]
];

grammar.forEach(rule => { rule[0] = new RegExp("^"+rule[0]); });

function lex (sn) {
    let pos = 0;
    const ret = [];
    while (pos<sn.length) {
        const sl = sn.slice(pos);
        for (const [re, rule] of grammar) {
            re.lastIndex = 0;
            const r = re.exec(sl);
            if (!r) continue;
            if (typeof rule == "function") {
                ret.push(...rule(r));
            } else {
                ret.push([rule, r[0]]);
            }
            pos += r[0].length;
            break;
        }
    }
    return ret;
}

export function Signotation ({ sn }) {
    const tokens = lex(sn)
    return <span className="signotation">
        {tokens.map(([cn, text], i) => <span key={i}
            className={cn}>{text}</span>)}
    </span>;
}
