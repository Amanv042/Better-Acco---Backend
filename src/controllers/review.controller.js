import {asyncHandler} from "../utils/asyncHandler.js"


const addReview = asyncHandler(async (req, res) => {
    console.log(req.body)
})


export {addReview} 