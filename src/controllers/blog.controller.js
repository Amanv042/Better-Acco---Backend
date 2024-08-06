import { asyncHandler } from "../utils/asyncHandler.js";

const addBlog = asyncHandler(async (req, res) => {
  console.log(req.body);
});

export { addBlog };
