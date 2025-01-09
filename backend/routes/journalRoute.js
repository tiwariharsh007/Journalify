import express from "express";
import { createJournal, deleteJournal, filterJournalsByDate, getallJournal, isFavouriteJournal, searchJournals, updateJournal } from "../controllers/journalController.js";
import { verifyToken } from "../utils/verifyUser.js";
import { upload } from "../utils/multer.js";
import { deleteImage } from "../utils/imgDel.js";

const router = express.Router();

router.route("/create").post(verifyToken, upload.single('image'), createJournal);
router.route("/getallJournal").get(verifyToken, getallJournal);
router.route("/deleteImage").delete(deleteImage);
router.route("/update/:id").put(verifyToken,updateJournal);
router.route("/delete/:id").delete(verifyToken,deleteJournal);
router.route("/favourite/:id").put(verifyToken,isFavouriteJournal);
router.route("/search").get(verifyToken,searchJournals);
router.route("/filter").get(verifyToken,filterJournalsByDate);

export default router;
