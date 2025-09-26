import { trusted } from "mongoose";
import { ShortURL } from "../models/shorturl.model.js";
import { nanoid } from "nanoid";
export const createShortURL = async (req, res) => {
  try {
    const { originalUrl, title, expiresAt, customUrl,userId } = req.body;
    let newNanoId = nanoid(7);

    while (true) {
      const existing = await ShortURL.findOne({ shortCode: customUrl });
      if (!existing) {
        break;
      }
      newNanoId = nanoid(7);
    }
    if (customUrl) {
      const existing = await ShortURL.findOne({ shortCode: customUrl });
      if (!existing) {
        newNanoId = customUrl;
      }
    }
    const newShortCode = await ShortURL.create({
      originalUrl,
      title,
      shortCode: newNanoId,
      expiresAt: new Date(expiresAt),
      userId,
    });
    res.status(200).json({
      message: "Successfully generated short url",
      data: newShortCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
}
  export const redirectToOriginal = async (req,res) =>{
    try{
        const {shortCode} = req.params;

        const doc = await ShortURL.findOne({shortCode});
        if(!doc)
        {
            return res.status(404).json({
                message: "Url does not exists"
            })
        }

        const originalUrl=doc.originalUrl;
        return res.redirect(originalUrl);
    }catch(error){
    console.error("Error in redirectToOriginalUrl",error.message);
    return res.status(500).json({
      message: error.message,
    });
   }

}
export const updateShortURLController=async(req,res)=>{
  try{
    const{ShortURL}=req.params;
    const existed=await ShortURL.findOne({shortCode:ShortURL});
    if(!existed){
      return res.status(404).json({
        status:"NOT_FOUND",
        message:"Short URL not found",
      });
    }
    //method 1
    Object.assign(existed,updatedData);
    await existed.save();
    
  }catch{
    console.error("Error updating short url", error);
    res.status(500).json({
      status:"INTERNAL_SERVER_ERROR",
      message: "Error updating short URL",
    });
  }
}
export const deleteShortURLController=async(req,res)=>{
  try {
    const { ShortUrl } = req.params;
    const existed = await ShortURL.findOne({ shortCode: ShortUrl });
    if (!existed) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "Short URL not found",
      });
    }
    existed.isActive = false;
    await existed.save();
  } catch {
    console.error("Error deleting short url", error);
    res.status(500).json({
      status: "INTERNAL_SERVER_ERROR",
      message: "Error deleting short URL",
    });
  }
}