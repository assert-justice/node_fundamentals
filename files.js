const fs = require('fs');

function concordance(lines){
    // Create the concordance object we will be mutating.
    const conc = {};
    // Iterate through lines. i is the index and therefore the line number of each line.
    for(const i in lines){
        // Get the line from lines by its index and split it into words.
        // If, after splitting, any of the "words" are empty strings remove them.
        const words = lines[i].split(" ").filter(str => str.length > 0);
        // For each word in a line
        for(const word of words){
            // If that word has never been seen before, add it as a key to conc and give it a value of an empty array.
            if(!conc[word]) {
                conc[word] = [];
            }
            // If that word hasn't already appeared on that line, add it to the array of line numbers.
            if(!conc[word].includes(i)) {
                conc[word].push(i);
            }
        }
    }
    return conc;
}

function main(args){
    if(args.length < 2){
        console.log("Not enough arguments!");
        return;
    }
    const text = fs.readFileSync(args[0], {encoding: "utf-8"});
    const lines = text.split("\n")
        .map(str => str.trim().toLowerCase().replace(/[^a-zA-Z ]+/g, ''));
    const conc = concordance(lines);
    const output = JSON.stringify(conc);
    fs.writeFileSync(args[1], output, {encoding: "utf-8"});
}

main(process.argv.slice(2));