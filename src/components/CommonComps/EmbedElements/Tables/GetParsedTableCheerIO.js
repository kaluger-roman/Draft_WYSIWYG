import cheerio from "cheerio";
import cheerioTableparser from "cheerio-tableparser";

export const transposeMatrix = matrix => matrix[0].map((col, i) => matrix.map(row => row[i]));
export const getParsedTable=(table)=>{
    let simpleTableText=``;
    Array.from(table.rows).forEach((row)=>{
            let tdss=``;
            Array.from(row.cells).forEach((cell)=>{
                tdss+=`<td rowspan="${cell.rowSpan}" colspan="${cell.colSpan}">${cell.id}</td>`
            });
            simpleTableText+=(`<tr>`+tdss+`</tr>`);
        }
    );
    let ch = cheerio.load(`<table id='complex'>`+simpleTableText+`</table>`);
    cheerioTableparser(ch);
    return ch("#complex").parsetable(true, true, true);
};