import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  addBlog,
  getBlogs,
  deleteBlog,
} from "../controllers/blog.controller.js";

const router = Router();

router.route("/all-blog").get(verifyJWT, getBlogs);
router.route("/add-blog").post(verifyJWT, addBlog);
router.route("/delete-blog/:id").delete(verifyJWT, deleteBlog);

export default router;
