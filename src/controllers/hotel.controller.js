import {asyncHandler} from "../utils/asyncHandler.js"


const registerHotel = asyncHandler(async (req, res) => {
    console.log(req.body)
})


export {registerHotel} 