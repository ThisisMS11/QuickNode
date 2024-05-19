import express from "express";
import cors from "cors";
import { generate } from './utils';
import { getAllFiles } from "./file";
import simpleGit from "simple-git";
import path from 'path'
import { uploadFile } from "./aws";
import { createClient } from "redis";
import dotenv from "dotenv";

const app = express();
const publisher = createClient();
publisher.connect();

app.use(cors());
app.use(express.json());
dotenv.config();


// POSTMAN
app.post("/deploy", async (req, res) => {
    console.log("Deployment Function");


    const repoUrl = req.body.repoUrl;
    const id = generate();

    await simpleGit().clone(repoUrl, path.join(__dirname + `/output/${id}`));

    const files = getAllFiles(path.join(__dirname + `/output/${id}`));

    /* iterate over all the files and send them to S3 using upload function */

    files.forEach(async file => {
        await uploadFile(file.slice(__dirname.length + 1), file);
    })
    
    publisher.lPush("build-queue", id);

    res.json({
        id: id
    })
});

app.listen(3000);

