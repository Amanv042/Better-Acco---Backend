import asyncHandler from "../utils/asyncHandler"


const addReview = asyncHandler(async (req, res) => {
    const { data } = req.body
    console.log(data)
})


export {addReview} 