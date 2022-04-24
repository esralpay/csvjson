import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
const data: any = {};
const line: any[] = [];
function handleRow(row: any) {
    // console.log(row);
    const columns = row[0].split(';');
    columns.forEach((element: any, index: number) => {
        if (element) {
            line[index] = element;
        }
    });
    // console.log(JSON.stringify(line));
    let target = data;
    for (let i = 0; i < 7; i++) {
        target = data;
        for (let j = 0; j <= i; j++) {
            if (j === 6) {
                if (line[5]) {
                    data[line[0]][line[1]][line[2]][line[3]][line[4]][line[5]] = Number(line[6]);
                } else {
                    data[line[0]][line[1]][line[2]][line[3]][line[4]] = Number(line[6]);
                }
            } else {
                if (!target[line[j]] && line[j]) {
                    target[line[j]] = {};
                }
                if (line[j]) {
                    target = target[line[j]];
                }
            }
        }
    }



}

function getTotal(input: any): number {
    if (isNaN(input)) {
        return Object.values(input).map(getTotal).reduce((sum, current) => sum + current, 0);
    }
    return input;
}

function updateKeys(data: any) {

    for (const [key, value] of Object.entries(data)) {
        if (isNaN(value as number)) {
            updateKeys(value);
        }
        const sum = getTotal(value);
        data[`${key} (${sum})`] = value;
        delete data[key];
    }
}


function handleFinish() {
    console.log(JSON.stringify(data));
    updateKeys(data);

    fs.writeFile('output3.json', JSON.stringify(data), function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });
}

fs.createReadStream(path.resolve(__dirname, 'input.csv'))
    .pipe(csv.parse({ headers: false }))
    .on('error', error => console.error(error))
    .on('data', handleRow)
    .on('end', handleFinish);
