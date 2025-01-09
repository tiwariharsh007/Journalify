// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// export const deleteImage = (req, res) => {
//   const { imageUrl } = req.query;

//   if (!imageUrl) {
//     return res.status(400).json({ error: true, message: "ImageUrl is required." });
//   }

//   try {
//     const filename = path.basename(imageUrl); // Extract file name
//     const fullPath = path.join(__dirname, "uploads", filename); // Construct full path

//     console.log("Received imageUrl:", imageUrl);
//     console.log("Constructed fullPath:", fullPath);

//     if (fs.existsSync(fullPath)) {
//       fs.unlink(fullPath, (err) => {
//         if (err) {
//           console.error("Error deleting file:", err);
//           return res.status(500).json({ error: true, message: "Failed to delete the file." });
//         }
//         return res.status(200).json({ message: "File deleted successfully." });
//       });
//     } else {
//       console.error("File not found at path:", fullPath);
//       return res.status(404).json({ error: true, message: "File not found." });
//     }
//   } catch (error) {
//     console.error("Error during file deletion:", error);
//     return res.status(500).json({ error: true, message: error.message });
//   }
// };

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

export const deleteImage = (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res.status(400).json({ error: true, message: "ImageUrl is required." });
  }

  try {
    const filename = path.basename(imageUrl); // Extract file name
    // const fullPath = path.join(__dirname, "uploads", filename); // Construct full path
    const fullPath = path.join(projectRoot, "uploads", filename);

    console.log("Received imageUrl:", imageUrl);
    console.log("Constructed fullPath:", fullPath);

    fs.access(fullPath, fs.constants.R_OK | fs.constants.W_OK, (accessErr) => {
      if (accessErr) {
        console.error("File access error:", accessErr);
        return res.status(404).json({ error: true, message: "File not found or inaccessible." });
      }

      // File exists and is accessible; attempt to delete
      fs.rm(fullPath, { force: true }, (rmErr) => {
        if (rmErr) {
          console.error("Error deleting file:", rmErr);
          return res.status(500).json({ error: true, message: "Failed to delete the file." });
        }
        console.log("File deleted successfully:", fullPath);
        return res.status(200).json({ message: "File deleted successfully." });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: true, message: error.message });
  }
};
