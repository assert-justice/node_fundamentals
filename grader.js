const fs = require("fs");

function parseLine(line){
    return line.replace(/["]/g, "").split(",").map(str => str.trim());
}

function parseCSV(text){
    const lines = text.split("\n").map(str => str.trim());
    const data = [];
    const keyNames = parseLine(lines[0]);
    console.log(keyNames);
    for (const line of lines.slice(1)){
        const fields = parseLine(line);
        const entry = {};
        for(const i in keyNames){
            const key = keyNames[i];
            const value = fields[i];
            entry[key] = value;
        }
        data.push(entry);
    }
    return data;
}

function main(args){
    if(args.length < 2){
        console.log("Not enough arguments!");
        return;
    }
    const text = fs.readFileSync(args[0], {encoding: "utf-8"});
    const data = parseCSV(text);
    const output = JSON.stringify(data);
    fs.writeFileSync(args[1], output, {encoding: "utf-8"});
}

main(process.argv.slice(2));