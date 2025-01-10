import express from "express";
import { createJournal, deleteJournal, filterJournalsByDate, getallJournal, isFavouriteJournal, searchJournals, updateJournal } from "../controllers/journalController.js";
import { verifyToken } from "../utils/verifyUser.js";
import { deleteImage } from "../utils/imgDel.js";
import { upload } from "../utils/multer.js";
import { uploadImageMiddleware } from "../utils/upload.js";

const router = express.Router();

router.route("/create").post(verifyToken, createJournal);
router.route("/getallJournal").get(verifyToken, getallJournal);
router.route("/deleteImage").delete(deleteImage);
router.route("/update/:id").put(verifyToken,updateJournal);
router.route("/delete/:id").delete(verifyToken,deleteJournal);
router.route("/favourite/:id").put(verifyToken,isFavouriteJournal);
router.route("/search").get(verifyToken,searchJournals);
router.route("/filter").get(verifyToken,filterJournalsByDate);
router.post("/upload-image", upload.single('image'), uploadImageMiddleware, (req, res) => {
    if (req.imgUrl) {
      return res.status(200).json({ imageUrl: req.imgUrl });
    }
    return res.status(400).json({ error: true, message: "Image upload failed" });
  });
export default router;
