import express from "express";

import multer from "multer";
// import createError from "http-errors";
import {writeUsersPicture} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/upload",
  multer().single("kapil"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      await writeUsersPicture(req.file.originalname, req.file.buffer);
      res.send("Image Uploaded! ");
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
