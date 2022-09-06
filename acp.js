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