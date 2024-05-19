import { createClient, commandOptions } from "redis";
import { downloadS3Folder,copyFinalDist } from "./aws";
import { buildProject } from "./utils";
import dotenv from "dotenv"

const subscriber = createClient();
subscriber.connect();
dotenv.config();

async function main() {
    while (1) {
        // pop from the right side 
        const response = await subscriber.brPop(
            commandOptions({ isolated: true }),
            'build-queue',
            0
        );

        const id = response?.element //@ts-ignore
        console.log({id})
        // await downloadS3Folder(`output/${id}`)
        await buildProject("e2dsp");
        
        copyFinalDist("e2dsp");
    }
}
main();
