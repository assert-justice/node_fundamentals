const { execSync } = require('child_process');

function shell(args){
    try{
        return {
            message: execSync(args, {encoding: "utf-8"}),
            error: null,
        }
    }
    catch(err){
        return {
            message: null,
            error: err.stderr,
        }
    }
}

module.exports = shell;