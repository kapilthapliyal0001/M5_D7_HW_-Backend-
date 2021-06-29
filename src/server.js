import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import blogRouter from "./blogs/index.js";
// import {join, dirname} from "path";
// import {fileURLToPath} from "url";

const server = express();
const port = process.env.port || 3001;

// section for routes and global middlewares
const whitelist = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PROD_URL,
  "http://localhost:3001",
];
server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not Allowed by cors"));
      }
    },
  })
);

server.use(express());
server.use(cors());
server.use(express.json());

// Server Routes

server.use("/blogs", blogRouter);

// Listen the server at port 3001;
console.table(listEndpoints(server));
server.listen(port, () => {
  console.log("✅Server is running on port: ", port);
});
server.on("error", (error) => {
  console.log("❌ Server is NOT running on the PORT: ", port);
});
