import fs from "fs";
import path from "path";

export const getAllFiles = (folderPath: string): string[] => {
    let response: string[] = [];

    if (!fs.existsSync(folderPath)) {
        console.error(`Directory does not exist: ${folderPath}`);
        return response; // Return an empty array if the directory doesn't exist
    }

    const allFilesAndFolders = fs.readdirSync(folderPath);
    allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath));
        } else {
            response.push(fullFilePath);
        }
    });

    return response;
};