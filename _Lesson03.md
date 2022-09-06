# Executing Subprocesses
We run a lot of commands a lot of times in the terminal. How many times have you typed the following:
```
git add .
git commit -m "some message"
git push
```
A lot right? Wouldn't it be nice if it was a single command? Well guess what, we can use JS to issue regular console commands like that.

## Modern Operating Systems, Hilariously Simplified
Every program running on your computer is what we call a process. An executable somewhere is ticking along and eventually that process ends. When it does it returns a status code. By convention a process returns 0 to indicate everything is copacetic, and a non zero value if something went wrong.

These processes can launch subprocesses or child processes of their own. There are a lot of ways to launch a child process in node. Like, a *lot*. It took a while for me to decide on the best one for our purposes. What I picked is the `execSync` function.

Note that you should be running these commands in git bash if you are on Windows. For reasons I'm not entirely clear on Powershell won't work.

You pass this function a command to execute and it returns the output of that command as a string. Create a file called `acp.js` (you'll see why in a minute) and add the following.

```js
const { execSync } = require('child_process');

console.log( execSync("ls", {encoding: "utf-8"}) );
```

If we run the above script it should print the contents of the current directory to the console. We ran the ls command! Just like when reading files we need to specify to execSync that we want a utf-8 string back. Let's try running another command. Let's make a directory called "cats".

```js
const { execSync } = require('child_process');

console.log( execSync("mkdir cats", {encoding: "utf-8"}) );
```

Now assuming you don't already have a directory called cats the script should create one for you. If we run this script *again* `execSync` will throw an error because you already have a "cats" directory. You'll want to check for that in a try/catch block.

## Add, Commit, Push
Let's write a script that will add, commit, and push the contents of the current directory. Here is the full code.

```js
const { execSync } = require('child_process');

function main(args){
    // Check if we have been passed sufficient arguments.
    if(args.length < 1){
        console.log("not enough arguments");
        return;
    }
    // Construct the commands we want to run.
    const commands = [
        "git add .",
        `git commit -m "${args[0]}"`,
        "git push"
    ];
    // For each command try to run it. If there is an error print it and break.
    for (const command of commands){
        try{
            execSync(command);
        }
        catch(err){
            console.log(err);
            break;
        }
    }
}

main(process.argv.slice(2));
```