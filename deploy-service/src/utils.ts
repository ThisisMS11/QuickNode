import { exec, spawn } from "child_process";
import path from "path";

export function buildProject(id: string | undefined) {
    return new Promise((resolve) => {

        if(id==undefined)
            return ;

        const temp = path.join(__dirname, `output/${id}`)

        console.log({temp});

        const child = exec(`cd ${temp} && npm install && npm run build`)

        child.stdout?.on('data', function (data) {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function (data) {
            console.log('stderr: ' + data);
        });

        child.on('close', function (code) {
            resolve("")
        });

    })
}
