import { createClient, commandOptions } from "redis";
import { downloadS3Folder, copyFinalDist } from "./aws";
import { buildProject } from "./utils";
import dotenv from "dotenv"

dotenv.config();

// you cannot use the same client to perform both get and put operations 
const subscriber = createClient();
const publisher = createClient();

subscriber.connect();
publisher.connect();


async function main() {
    while (true) {
        try {
            // Pop from the right side of the 'build-queue'
            const response = await subscriber.brPop(
                commandOptions({ isolated: true }),
                'build-queue',
                0
            );

            const id = response?.element; // Ensure id is of type string
            if (!id) {
                console.error("No ID found in the response");
                continue;
            }

            console.log({ id });

            await downloadS3Folder(`output/${id}`);
            await buildProject(id);
            copyFinalDist(id);

            // Use type assertion to ensure id is a string
            await publisher.hSet("status", id as string, "deployed");
        } catch (error) {
            console.error("Error processing job:", error);
        }
    }
}

main();
