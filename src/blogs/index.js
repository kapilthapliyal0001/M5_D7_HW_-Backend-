import express from "express";
import fs from "fs";
import path, {dirname, join} from "path";
import {fileURLToPath} from "url";
import uniqid from "uniqid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const blogFilePath = path.join(__dirname, "../data/files.json");

const blogRouter = express.Router();

// Get all the products

blogRouter.get("/", async (req, res, next) => {
  try {
    const fileAsBuffer = fs.readFileSync(blogFilePath);
    const fileAsString = fileAsBuffer.toString();
    const fileAsJSON = JSON.parse(fileAsString);
    console.log(fileAsJSON);
    res.send(fileAsJSON);
  } catch (error) {
    res.send(500).send({message: error.message});
  }
});

export default blogRouter;
