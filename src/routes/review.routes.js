import { Router } from "express";

import { addReview } from "../controllers/review.controller.js";

const router = Router();

router.route("/add-review").post(addReview);

export default router;
