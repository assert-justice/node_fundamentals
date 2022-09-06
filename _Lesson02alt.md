# Working With CSV
The csv format (comma separated values) is really common and any spreadsheet program can read and export to them. You can automate a lot of tedious spreadsheet bs with a proper programming language. Further you can analyze spreadsheets and then put "data scientist" in your cv. 

## What's in a CSV
Create a file called `grades.csv`. You can find a bunch of example csv files [here](https://people.sc.fsu.edu/~jburkardt/data/csv/csv.html).
We're going to adapt their grade data. On their website they were missing a comma. This is actually an excellent introduction to working with data in the wild, they often need manual cleanup.

Here's the contents of that file:

```
"Last name", "First name", "SSN",        "Test1", "Test2", "Test3", "Test4", "Final", "Grade"
"Alfalfa",   "Aloysius",   "123-45-6789", 40.0,    90.0,   100.0,    83.0,    49.0,   "D-"
"Alfred",    "University", "123-12-1234", 41.0,    97.0,    96.0,    97.0,    48.0,   "D+"
"Gerty",     "Gramma",     "567-89-0123", 41.0,    80.0,    60.0,    40.0,    44.0,   "C"
"Android",   "Electric",   "087-65-4321", 42.0,    23.0,    36.0,    45.0,    47.0,   "B-"
"Bumpkin",   "Fred",       "456-78-9012", 43.0,    78.0,    88.0,    77.0,    45.0,   "A-"
"Rubble",    "Betty",      "234-56-7890", 44.0,    90.0,    80.0,    90.0,    46.0,   "C-"
"Noshow",    "Cecil",      "345-67-8901", 45.0,    11.0,    -1.0,     4.0,    43.0,   "F"
"Buff",      "Bif",        "632-79-9939", 46.0,    20.0,    30.0,    40.0,    50.0,   "B+"
"Airpump",   "Andrew",     "223-45-6789", 49.0,      1.0,    90.0,   100.0,    83.0,   "A"
"Backus",    "Jim",        "143-12-1234", 48.0,     1.0,    97.0,    96.0,    97.0,   "A+"
"Carnivore", "Art",        "565-89-0123", 44.0,     1.0,    80.0,    60.0,    40.0,   "D+"
"Dandy",     "Jim",        "087-75-4321", 47.0,     1.0,    23.0,    36.0,    45.0,   "C+"
"Elephant",  "Ima",        "456-71-9012", 45.0,     1.0,    78.0,    88.0,    77.0,   "B-"
"Franklin",  "Benny",      "234-56-2890", 50.0,     1.0,    90.0,    80.0,    90.0,   "B-"
"George",    "Boy",        "345-67-3901", 40.0,     1.0,    11.0,    -1.0,     4.0,   "B"
"Heffalump", "Harvey",     "632-79-9439", 30.0,     1.0,    20.0,    30.0,    40.0,   "C"
```

So we have a bunch of student records. The first row the names of the fields and every row after that is an entry. We can read and print the data just as before. Let's do a little bit of preemptive cleaning up.

```js
function main(args){
    const text = fs.readFileSync(args[0], {encoding: "utf-8"});
    console.log(text);
}

main(process.argv.slice(2));
```

Now if we run the command `node grader.js grades.csv` it'll print the contents of the file to the console.

## 1000ft View
We have this data, we can read it, print it, do all sorts of stuff with it. Our goal is to be able to work with this data in a more convenient format. We want to break these records into an array of objects that look like this:

```js
{
    "Last name": "Alfalfa", 
    "First name": "Aloysius", 
    SSN: "123-45-6789",        
    Test1: 40.0, 
    Test2: 90.0, 
    Test3: 100.0, 
    Test4: 83.0, 
    Final: 49.0, 
    Grade: "D-"
}
```

Now maybe there is some schema that suits our needs better but this is the format we're given so it makes sense to translate the csv file we're given into this format before messing with it further. Ok, how do?

## Parsing
Let's write a helper function that will help us parse each line in our file into something more helpful. Check it out:

```js
function parseLine(line){
    return line.replace(/["]/g, "").split(",").map(str => str.trim());
}
```

This time we have a much simpler regex that removes all the double quotes from our line, splits our lines up based on commas (because it's a csv) and then trim the excess off of each resulting string in this array. We can use this function on both the first line with the field names and all the subsequent lines with the data. So the string 
```
"Last name", "First name", "SSN", "Test1", "Test2", "Test3", "Test4", "Final", "Grade"
```
becomes
```js
[
  'Last name', 'First name',
  'SSN',       'Test1',
  'Test2',     'Test3',
  'Test4',     'Final',
  'Grade'
]
```

Alright. Enough screwing around. Let's write a function to parse our data.

```js
function parseCSV(text){
    // Break our text into lines and ignore empty ones (as before).
    const lines = text.split("\n").map(str => str.trim());
    // Create an array that'll serve as our accumulator.
    const data = [];
    // The first line represents the fields of each object. Set that line aside.
    const keyNames = parseLine(lines[0]);
    // For every line after:
    for (const line of lines.slice(1)){
        const fields = parseLine(line);
        // Create an object to store our record
        const entry = {};
        // Loop through the fields in the first line
        for(const i in keyNames){
            const key = keyNames[i];
            const value = fields[i];
            // In our record object assign each field from the first line with the corresponding value from this line.
            entry[key] = value;
        }
        // Push our entry object to the accumulator.
        data.push(entry);
    }
    return data;
}
```

Hopefully that isn't too bad. Unfortunately while I can write code and explain code, only you can really teach yourself to take a problem, break it up, and solve it. Like anything else, you learn by doing. Let's look at the full code:

## Full Code
Below is the full code of the example. We read the contents of the csv, parse it, and write it as a json specified by the command line arguments. So if you run `node grader.js grades.csv grade_data.json` it should create and write to the grade_data file.

```js
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
```

## Exercises
1. We set up the code in this lesson to accept arbitrary source and destination filepaths. Download and try to parse more CSVs. Do they work? If they break, why? What error handling can you perform if parsing fails?
1. Every value in each record object is a string, but the test percentages should be numbers. Write a function that accepts a record object and returns an object where the test percentages are numbers.
1. Do some analysis on the data. Who has the best average grade? If you allow a student to drop their worst test does that change who has the best grade?