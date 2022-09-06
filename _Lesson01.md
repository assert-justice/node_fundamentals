# Command Line Arguments
You've worked with command line arguments if you've used git, node, or npm. A couple classic commands are `git add .` and `npm run start:dev`. 

## Getting Our Feet Wet
Let's break down the first command.

- `git` is the name of the program. Somewhere on your computer a binary executable named `git` is stored. Your computer knows how to find this binary because your `PATH` environmental variable includes this directory's executable (more on this later).
- `add` is the action you want git to perform. The `add` command tells git to track the changes to a file.
- `.` tells git which files to add. We could supply a specific filepath for git to add but usually we just want to add everything in a directory and all the subdirectories so we use `.`

Now let's create a command line app of our own. Create a file called `calc.js` and write the following in it:

```js
console.log(process.argv);
```

`process` is a built in variable available to any script running under node. Don't try this in the browser! Well you can but it won't work. `argv` is a field of that object that contains all the arguments we passed to it.

When I run the file with the command `node calc.js hello node!` it prints the following to the console:
```js
[
  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\riley\\Documents\\assert_justice\\wbdty\\node\\calc.js',
  'hello',
  'node!'
]
```
I'm running this on Windows. If you are using another less barbaric OS it will look different but similar. Our script has logged an array with four strings in it. The first is the path to my node executable. The second is the path to the script I'm running. Most of the time we'll ignore these. The third and fourth arguments are what we passed to our script, two strings. If we run a slightly different command `node .\calc.js "hello node!"` the result is
```js
[
  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\riley\\Documents\\assert_justice\\wbdty\\node\\calc.js',
  'hello node!'
]
```
That is probably closer to what we want. Ok! We're off to the races. Let's write a program of dizzying complexity, a calculator that adds two numbers! For all the next examples we'll be using the following command: `node calc.js 5 10`. When it's working it should log `15` in response. Let's see what our existing program prints when we run the command:
```js
[
  'C:\\Program Files\\nodejs\\node.exe',
  'C:\\Users\\riley\\Documents\\assert_justice\\wbdty\\node\\calc.js',
  '5',
  '10'
]
```
Hopefully that makes sense. Let's move on. Because we don't care about the first two arguments (for now) let's only log a slice of the argv array. Change `calc.js` to 
```js
console.log(process.argv.slice(2));
```
and it will log
```js
[ '5', '10' ]
```

## A Main Function
Let's go ahead and create a main function and pass it the arguments we care about. We're not going to do a lot of error checking but let's at least make sure we have two arguments. If we don't log "Not enough arguments!" Otherwise add the first element to the second and log the result. Try this:
```js
function main(args){
    if(args.length < 2){
        console.log("Not enough arguments!");
        return;
    }
    console.log(args[0] + args[1]);
}
main(process.argv.slice(2));
```
This, of course, logs `510`. D'ho! You fell victim to one of the classic blunders! The most famous is never get involved in a land war in Asia but only slightly less famous is remember everything in JS is a string unless we cajole it otherwise!

There are way too many ways to convert strings to numbers in JS. There are too many ways to do everything. I'm going to use the unary plus sign like so:
```js
function main(args){
    if(args.length < 2){
        console.log("Not enough arguments!");
        return;
    }
    console.log(+args[0] + +args[1]);
}
main(process.argv.slice(2));
```

Suppose sometimes you want to subtract numbers instead of add them. Heresy! Well let's add a command that tells our program what to do.

```js
function main(args){
    if(args.length < 3){
        console.log("Not enough arguments!");
        return;
    }
    if(args[0] === "add"){
        console.log(+args[1] + +args[2]);
    }
    else if(args[0] === "sub"){
        console.log(+args[1] - +args[2]);
    }
    else{
        console.log(`Command '${args[0]}' not recognized!`);
    }
}
main(process.argv.slice(2));
```

I've pasted a few commands and their output in a table. 
|Command|Output|
|---|---|
|`node .\calc.js add 5 10`|15|
|`node .\calc.js sub 5 10`|-5|
|`node .\calc.js sub 10 5`|5|
|`node .\calc.js nope 5 10`|Command 'nope' not recognized!|

## Bonus Problems
1. Add multiplication, division, exponentiation and modulo (if you're feeling fancy) options to our program.
1. The naive implementation involves a lot of code duplication. Can you come up with a more elegant way to handle all these different cases? Higher order functions perhaps?
1. Add a `sum` command. This should accept an arbitrary number of arguments. For example `sum 11 9 20` should print `40`. `sum 1 2 3 4 5 6 7 8 9 10` should print `55`. Of course the order of the arguments shouldn't matter.