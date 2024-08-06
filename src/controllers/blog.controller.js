import asyncHandler from "../utils/asyncHandler"


const addBlog = asyncHandler(async (req, res) => {
    const { data } = req.body
    console.log(data)
})


export {addBlog} 