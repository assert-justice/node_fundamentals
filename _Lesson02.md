# File IO
Reading and writing files is one of the most fundamental thing a computer does and a lot of bootcamps completely ignore it! Guess what, you can read and write files in JS. 

## Reading is Essential
Create a file called `service.txt` and enter the following:
```
There are strange things done in the midnight sun
By the men who moil for gold;
The Arctic trails have their secret tales
That would make your blood run cold;
The Northern Lights have seen queer sights,
But the queerest they ever did see
Was that night on the marge of Lake Lebarge
I cremated Sam McGee.
```

These are the opening lines of a very fun (and very Public Domain) poem called *The Cremation of Sam McGee* by Robert W. Service. He was a Scottish bank teller who decided to be a Yukon Cowboy which is pretty rad. He also acted alongside Marlene Dietrich in *The Spoilers* (1942) so we have no choice but to stan. By the standards of early 20th century poets he wasn't *that* problematic.

Anyway we want to analyze the poem. Node has a module for this called `fs`. Let's create a script called `files.js` and write the following:
```js
const fs = require('fs');

const text = fs.readFileSync("./service.txt", {encoding: "utf-8"});
console.log(text);
```

If we run this script it will print the contents of the file to the console. Let's break down the above.

Unlike `process` we do have to explicitly import the `fs` module. The function we're using is `readFileSync` which we pass a filepath and an object of options. The option we care about is encoding, we want to specify the text file is using utf-8 encoding. It doesn't matter much for a file that's all ascii like this one but if we were dealing with a text not written in English we would assuredly need to consider it. I might make a video about text encoding another time but that is a deep deep rabbit hole.

Anyway the result we get back is a string, and we can log that string like normal. Let's break it into lines!

```js
const fs = require('fs');

const text = fs.readFileSync("./service.txt", {encoding: "utf-8"});
console.log(text.split("\n"));
```
On my computer it prints the following:
```js
[
  'There are strange things done in the midnight sun\r',
  'By the men who moil for gold;\r',
  'The Arctic trails have their secret tales\r',
  'That would make your blood run cold;\r',
  'The Northern Lights have seen queer sights,\r',
  'But the queerest they ever did see\r',
  'Was that night on the marge of Lake Lebarge\r',
  'I cremated Sam McGee.'
]
```
Woah woah woah woah. What the hell does `\r` mean?

## Riley Whinges about Windows for a While

Hopefully `text.split("\n")` was clear enough. `\n` is one of several special escape characters that start with a backslash followed by a letter. There are a bunch of them, `\n` means "new line" so we use it to split the text up into lines. But again, what does `\r` mean?

Well the short version is it's a Windows thing. If you're on another OS you won't see these. This is an excellent example of why, no matter how high level your language, you can't get rid of OS specific bs entirely. That character means "carriage return" and it's from when the best printer available was a glorified typewriter. We're going to sidestep this issue by trimming each line of the whitespace before and after each line with `trim`. While we're at it we'll use `toLowerCase` to convert each line to lower case (duh) and a sneaky little replace to get rid of the punctuation. We'll use a regular expression for this which, again, we'll have to save for another day.

## Tidy and Trimmed

```js
const fs = require('fs');

const text = fs.readFileSync("./service.txt", {encoding: "utf-8"});
const lines = text.split("\n").map(str => str.trim().toLowerCase().replace(/[^a-zA-Z ]+/g, ''));
console.log(lines);
```

That line 4 is starting to look a little nasty. The replace uses a regex to remove anything that isn't a letter or a space. I don't know if this code sparks joy but whaddya gonna do. It prints the following

```js
[
  'there are strange things done in the midnight sun',
  'by the men who moil for gold',
  'the arctic trails have their secret tales',
  'that would make your blood run cold',
  'the northern lights have seen queer sights',
  'but the queerest they ever did see',
  'was that night on the marge of lake lebarge',
  'i cremated sam mcgee'
]
```

## Concordance for Fun and Profit
Let's construct a [concordance](https://en.wikipedia.org/wiki/Concordance_(publishing)) of the text. We'll create an object where every word is a key and the associated value is an array of the lines where it appears. I'm going to drop a whole buncha code on you buckle up:
```js
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
```
I'm not going to step through this code line by line but I did comment it for you if you want to tease it out. Suffice it to say it creates an object we'll be returning. Then loops through each line and breaks each line into words. Then for each of those words if we haven't seen it before make it a key and assign it an array. If that array doesn't contain the current line number, push the current line number. Return the concordance object when done. Simple as pie.

Here's how we call our new function:
```js
const text = fs.readFileSync("./service.txt", {encoding: "utf-8"});
const lines = text.split("\n").map(str => str.trim().toLowerCase().replace(/[^a-zA-Z ]+/g, ''));
const conc = concordance(lines);
console.log(conc);
```

The output is the following:
```js
{
  there: [ '0' ],
  are: [ '0' ],
  strange: [ '0' ],
  things: [ '0' ],
  done: [ '0' ],
  in: [ '0' ],
  the: [ '0', '1', '2', '4', '5', '6' ],
  midnight: [ '0' ],
  sun: [ '0' ],
  by: [ '1' ],
  men: [ '1' ],
  who: [ '1' ],
  moil: [ '1' ],
  for: [ '1' ],
  gold: [ '1' ],
  arctic: [ '2' ],
  trails: [ '2' ],
  have: [ '2', '4' ],
  their: [ '2' ],
  secret: [ '2' ],
  tales: [ '2' ],
  that: [ '3', '6' ],
  would: [ '3' ],
  make: [ '3' ],
  your: [ '3' ],
  blood: [ '3' ],
  run: [ '3' ],
  cold: [ '3' ],
  northern: [ '4' ],
  lights: [ '4' ],
  seen: [ '4' ],
  queer: [ '4' ],
  sights: [ '4' ],
  but: [ '5' ],
  queerest: [ '5' ],
  they: [ '5' ],
  ever: [ '5' ],
  did: [ '5' ],
  see: [ '5' ],
  was: [ '6' ],
  night: [ '6' ],
  on: [ '6' ],
  marge: [ '6' ],
  of: [ '6' ],
  lake: [ '6' ],
  lebarge: [ '6' ],
  i: [ '7' ],
  cremated: [ '7' ],
  sam: [ '7' ],
  mcgee: [ '7' ]
}
```
You can see that most words only appear once, the exceptions aren't terribly surprising. They are "the", "have", and "that" with "the" appearing by far the most.

## I Guess Writing is Pretty Important Too

"Ah but wise teacher" you say, studious pupil that you are "what if I want to store this data somewhere so I don't have to process it again?" To which I reply "bring in a million dependencies and store it on a Mongo DB cluster".

Mmmmmm no. Let's convert it to Json and save it to a file.

```js
const text = fs.readFileSync("./service.txt", {encoding: "utf-8"});
const lines = text.split("\n").map(str => str.trim().toLowerCase().replace(/[^a-zA-Z ]+/g, ''));
const conc = concordance(lines);
const output = JSON.stringify(conc);
fs.writeFileSync("./conc.json", output, {encoding: "utf-8"});
```

You should have used `JSON.stringify` before but as a reminder what it does is take a JavaScript value, usually an object or array, and convert it into a string following the json format. It's worth remembering that while json does look a lot like a JS, they are different formats. Json is annoyingly restricted in a couple of ways, it doesn't allow trailing commas or comments. A few attempts have been made to extend it but none have really caught on. A JSON-X format if you will.

`writeFileSync` should be pretty straightforward. We supply it with the path of a file to write to, a string to write, and, again, an encoding option. It's not as necessary as when we're decoding it but might as well be explicit.

## CLI? I Thought You Would Never Ask!

So, great. We have our app. It can read one file and output the contents into another one. But we just learned about command line arguments! Let's use them!

Let's refactor our code into a `main` function and call it with the arguments we care about as before.

```js
function main(args){
    if(args.length < 2){
        console.log("Not enough arguments!");
        return;
    }
    const text = fs.readFileSync(args[0], {encoding: "utf-8"});
    const lines = text.split("\n").map(str => str.trim().toLowerCase().replace(/[^a-zA-Z ]+/g, ''));
    const conc = concordance(lines);
    const output = JSON.stringify(conc);
    fs.writeFileSync(args[1], output, {encoding: "utf-8"});
}

main(process.argv.slice(2));
```

Now we can run the script and pass it arbitrary filenames like so: `node files.js service.txt conc.json`.

Let's apply our script to another file. This time prose, specifically the opening to Edgar Allen Poe's *The Cask of Amontillado*. Create a file called `poe.txt` and add the following:

```
The thousand injuries of Fortunato I had borne as I best could, but when he ventured upon insult I vowed revenge.
You, who so well know the nature of my soul, will not suppose, however, that I gave utterance to a threat.
At length I would be avenged; this was a point definitively settled - but the very definitiveness with which it was resolved precluded the idea of risk.
I must not only punish but punish with impunity.
A wrong is unredressed when retribution overtakes its redresser.
It is equally unredressed when the avenger fails to make himself felt as such to him who has done the wrong.
```

This is the one where the narrator buries a dude alive in his catacombs. Uh, spoilers? I guess?

Anyway now that we made our script accept command line arguments we can run the following `node files.js poe.txt poe.json` and it poops out our `poe.json` file! No changes to the code needed.

And there you go! That's the whole jawn! For reference here is the finished `files.js` script:
```js
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
```

## Bonus Exercises 
1. Try throwing more poems at it! Check you out some [poems](https://www.poetryfoundation.org/poems). Get some culture, get some Keats and Longfellow, Dickinson and Ginsburg, Baldwin and Woolf. The code I gave you is reasonably robust, try it out!
1. Take the words in a poem and rank them in order from most to least common. 
1. Create an object where the words are keys and the values are the percentage of the words in the poem are that word. For example in this snippet %12 of the words are "the". Make sure to save that object to a file.