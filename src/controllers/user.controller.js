import asyncHandler from "../utils/asyncHandler"


const registerUser = asyncHandler(async (req, res) => {
    const { data } = req.body
    console.log(data)
})


export {registerUser} 