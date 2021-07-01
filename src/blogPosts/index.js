import express from "express";
import uniqid from "uniqid";
import createError from "http-errors";

import fs from "fs";
import path, {dirname, join} from "path";

import {fileURLToPath} from "url";

import {validationResult} from "express-validator";
import {postValidation} from "./validation.js";
import {type} from "os";

// const __fileName = fileURLToPath(import.meta.url);
const __fileName = fileURLToPath(import.meta.url);

const __dirName = dirname(__fileName);

const blogPostPath = join(__dirName, "blogPosts.json");

const postRouter = express.Router();

// function to get the file

function getPost() {
  const fileAsBuffer = fs.readFileSync(blogPostPath);
  const fileAsString = fileAsBuffer.toString();
  const fileAsJson = JSON.parse(fileAsString);
  return fileAsJson;
}

// function to put the file back

function putPost(fileName) {
  fs.writeFileSync(blogPostPath, JSON.stringify(fileName));
}

// get all the posts

postRouter.get("/", (req, res, next) => {
  try {
    const file = getPost();

    res.send(file);
  } catch (error) {
    next(error);
  }
});

// get single post

postRouter.get("/:id", async (req, res, next) => {
  try {
    const file = getPost();
    const new_file = file.find((p) => p._id.toString() === req.params.id);
    if (new_file) {
      res.send(new_file);
    } else {
      next(
        createError(404, `User with the id ${req.params.id} doesn't exists`)
      );
    }
  } catch (error) {
    next(error);
  }
});

//post somthing
postRouter.post("/", postValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    // console.log(errors, "Check this");
    // validation result gives back a list of errors coming from the userValidation Middleware
    if (errors.isEmpty()) {
      const file = getPost();
      // console.log(req.body, ": this is the body of the request");
      const new_file = {
        ...req.body,
        _id: uniqid(),
        created_at: new Date(),
        // cover: `https://picsum.photos/200/300.jpg`,
        author: {
          name: req.body.name,
          avatar: `https://picsum.photos/200/200.jpg`,
        },
        content: `<div ${req.body.content}</div>`,
        readTime: {
          value: Math.floor(req.body.content.split(" ").length / 228),
          unit: "Minutes",
        },
      };
      file.push(new_file);
      // console.log(file);
      putPost(file);
      res.status(201).send(new_file);
    } else {
      // console.log(errors);
      next(createError(400, {errorList: errors}));
      // I had validation errors
    }
  } catch (error) {
    next(error);
  }
});

// update post
postRouter.put("/:id", async (req, res, next) => {
  try {
    const file = getPost();
    const post = file.find((p) => p._id === req.params.id);
    const new_file = {...post, ...req.body};
    file.push(new_file);
    putPost(file);
    res.send(new_file);
  } catch (error) {
    next(error);
  }
});

// delete post
postRouter.delete("/:id", async (req, res, next) => {
  try {
    const file = getPost();
    const new_file = file.filter((p) => p._id !== req.params.id);
    putPost(new_file);
    res.send("DELETED");
  } catch (error) {
    next(error);
  }
});

export default postRouter;
