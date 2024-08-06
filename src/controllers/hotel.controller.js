import asyncHandler from "../utils/asyncHandler"


const registerHotel = asyncHandler(async (req, res) => {
    const { data } = req.body
    console.log(data)
})


export {registerHotel} 