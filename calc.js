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