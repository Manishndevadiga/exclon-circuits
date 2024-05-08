const path = require("path");
const fs = require("fs");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");
const Uploads = require("../models/uploads");

module.exports = {
  uploadFile: (req, res) => {
    res.render("upload");
  },

  post_uploadFile: async (req, res) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).send({
          status: false,
          message: "Multer error occurred",
          error: err,
        });
      } else if (err) {
        return res.status(500).send({
          status: false,
          message: "Error occurred during file upload",
          error: err,
        });
      }

      if (!req.file) {
        return res.status(400).send({
          status: false,
          message: "No file uploaded",
        });
      }

      const uploadDirectory = path.join(__dirname, "..", "uploads");
      console.log(req.file.buffer);

      const originalFileName = req.file.originalname;

      const result = await Uploads.find({ originalFileName: originalFileName });
      if (result.length > 0) {
        return res.status(400).send({
          status: false,
          message: "File already exists",
        });
      }

      fs.writeFileSync(
        path.join(uploadDirectory, req.file.originalname),
        req.file.buffer
      );

      const fileName = req.file.originalname;
      const fileSize = req.file.size;
      const fileType = req.file.mimetype;

      const fileExtension = req.file.originalname.split(".").pop();
      const uploadDateTime = new Date();

      console.log("File Name:", fileName);
      console.log("File Size:", fileSize, "bytes");
      console.log("File Type:", fileType);
      console.log("Original File Name:", originalFileName);
      console.log("File Extension:", fileExtension);
      console.log("Date/Time of Upload:", uploadDateTime);

      const upload = new Uploads({
        fileName: fileName,
        fileSize: fileSize,
        fileType: fileType,
        originalFileName: originalFileName,
        fileExtension: fileExtension,
        uploadDateTime: uploadDateTime,
      });
      await upload.save();

      res.send({
        status: true,
        message: "File uploaded successfully",
        data: {
          filename: req.file.originalname,
          size: req.file.size,
        },
      });
    });
  },

  get_files: async (req, res) => {
    const fileLists = await Uploads.find({}, { fileName: 1, _id: 0 });
    return res.send({ data: fileLists });
  },

  get_file_by_name: async (req, res) => {
    const { fileName } = req.query;

    const file = await Uploads.findOne({ fileName });
    console.log(file);

    if (!file) {
      return res.status(404).send({ status: false, message: "File not found" });
    }

    const filePath = path.join(__dirname, "..", "uploads", fileName);
    res.sendFile(filePath);
  },

  delete_file: async (req, res) => {
    const { fileName } = req.query;
    console.log(fileName);
    const uploadDirectory = path.join(__dirname, "..", "uploads");

    try {
      fs.unlinkSync(path.join(uploadDirectory, fileName));
    } catch (err) {
      return res
        .status(404)
        .send({ status: false, message: "No such file exists" });
    }
    const deleteResult = await Uploads.deleteOne({ fileName: fileName });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).send({
        status: false,
        message: "No such file exists in the database",
      });
    }

    return res.send({ status: true, message: "File deleted successfully" });
  },
};
