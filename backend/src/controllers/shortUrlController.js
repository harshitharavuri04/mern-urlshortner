import { trusted } from "mongoose";
import { ShortURL } from "../models/shorturl.model.js";
import { nanoid } from "nanoid";
export const createShortURL = async (req, res) => {
  try {
    const { originalUrl, title, expiresAt, customUrl } = req.body;
    let newNanoId = nanoid(7);

    if (customUrl) {
      const existing = await ShortURL.findOne({ shortCode: customUrl });
      if (!existing) newNanoId = customUrl;
    } else {
      while (true) {
        const existing = await ShortURL.findOne({ shortCode: newNanoId });
        if (!existing) break;
        newNanoId = nanoid(7);
      }
    }

    const newShortCode = await ShortURL.create({
      originalUrl,
      title,
      shortCode: newNanoId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      userId: req.user.id, // ✅ assign logged-in user
      isActive: true,
    });

    res.status(200).json({
      message: "Successfully generated short url",
      data: newShortCode,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const redirectToOriginal = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const doc = await ShortURL.findOne({ shortCode, isActive: true });
    if (!doc) {
      return res.status(404).send("URL not found or inactive");
    }

    // ✅ Use absolute URL
    return res.redirect(doc.originalUrl);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
};

// ✅ Update Short URL
export const updateShortURLController = async (req, res) => {
  try {
    const { shortURL } = req.params; // <-- matches route param
    const updatedData = req.body;

    const existed = await ShortURL.findOne({ shortCode: shortURL });
    if (!existed) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "Short URL not found",
      });
    }

    Object.assign(existed, updatedData);
    await existed.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "Short URL updated successfully",
      data: existed,
    });
  } catch (error) {
    console.error("Error updating short url", error);
    res.status(500).json({
      status: "INTERNAL_SERVER_ERROR",
      message: "Error updating short URL",
    });
  }
};

export const deleteShortURLController = async (req, res) => {
  try {
    const { shortURL } = req.params; // <-- match route param
    const existed = await ShortURL.findOne({ shortCode: shortURL });

    if (!existed) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "Short URL not found",
      });
    }

    existed.isActive = false;
    await existed.save();

    res.status(200).json({
      status: "SUCCESS",
      message: "Short URL deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting short url", error);
    res.status(500).json({
      status: "INTERNAL_SERVER_ERROR",
      message: "Error deleting short URL",
    });
  }
};
