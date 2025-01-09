import { Journal } from "../models/journalSchema.js";
import { errorHandler } from '../utils/error.js';
import { upload } from '../utils/multer.js';

// journal banane ke liye
export const createJournal = async (req, res, next) => {
  const { title, story, visitedLocation, visitedDate ,imageUrl} = req.body;

  try {
    // if (!req.file) {
    //   return res.status(400).json({ error: true, message: "No file uploaded" });
    // }

    // const imageUrl = `/uploads/${req.file.filename}`;
    // if(imageUrl)return res.json(imageUrl);

    // if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    //   return res.status(400).json({ error: true, message: "All fields are required" });
    // }
    
    const parsedVisitedDate = new Date(parseInt(visitedDate));
    const journal = await Journal.create({
      title,
      story,
      visitedLocation,
      imageUrl,
      visitedDate: parsedVisitedDate,
      userId:req.userRef.id,
    });

    return res.status(201).json(journal);

  } catch (error) {
    next(error);
  }
};

// saare journals
export const getallJournal = async (req, res, next) => {
  const userID = req.userRef.id;
  try {
    const allJournals = await Journal.find({ userId: userID });
    return res.status(200).json({
      message: 'All journals retrieved successfully',
      allJournals,
    });
  } catch (error) {
    next(error);
  }
};

// journal ko edit karne ke liye 
export const updateJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal) {
      return next(errorHandler(404, 'Journal not found!'));
    }

    // Check if the logged-in user is the owner of the journal
    if (req.userRef.id !== journal.userId.toString()) {
      return next(errorHandler(401, 'You can only update your own journals!'));
    }

    // Update the journal with the new data
    const updatedJournal = await Journal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedJournal);
  } catch (error) {
    next(error);
  }
};

// delete journal 
export const deleteJournal = async (req, res, next) => {
  const journal = await Journal.findById(req.params.id);

  if (!journal) {
    return next(errorHandler(404, 'Journal not found!'));
  }

  if (req.userRef.id !== journal.userId.toString()) {
    return next(errorHandler(401, 'You can only delete your own journals!'));
  }

  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.status(200).json('Journal has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const isFavouriteJournal = async (req, res, next) => {
  const journal = await Journal.findById(req.params.id);
  if (!journal) {
    return next(errorHandler(404, 'Journal not found!'));
  }

  if (req.userRef.id !== journal.userId.toString()) {
    return next(errorHandler(401, 'You can like or dislike only your own journals!'));
  }
  try {
    journal.isFavourite = !journal.isFavourite;
    await journal.save();
    res.status(200).json(`Journal entry ${journal.isFavourite ? 'Favourite' : 'Not Favourite'} successfully`);
  } catch (error) {
    next(error);
  }
};

export const searchJournals = async (req, res, next) => {
  const { query } = req.query;
  const userId = req.userRef.id;

  if (!query) {
    return res.status(400).json({ error: true, message: "Query is required." });
  }

  try {
    const searchResults = await Journal.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ message: "Journals retrieved successfully", journals: searchResults });
  } catch (error) {
    next(error);
  }
};

// filter by date range 
export const filterJournalsByDate = async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const userId = req.userRef.id;  // Ensure userRef contains the correct user info

  if (!startDate || !endDate) {
    return res.status(400).json({ error: true, message: "Start date and end date are required." });
  }

  // Log values for debugging
  console.log('User ID:', userId);
  console.log('Start Date:', startDate);
  console.log('End Date:', endDate);

  try {
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    // Log parsed dates for debugging
    console.log('Parsed Start Date:', start);
    console.log('Parsed End Date:', end);

    const filteredJournals = await Journal.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    });

    res.status(200).json({ message: "Journals filtered by date", journals: filteredJournals });
  } catch (error) {
    next(error);
  }
};
