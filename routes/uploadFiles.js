const express = require("express");
const router = express.Router();

const upload = require("../controllers/uploadFiles");


router.get("/upload", upload.uploadFile);
router.post("/uploadFile", upload.post_uploadFile);
router.get("/getFileLists", upload.get_files);
router.get("/deleteFile", upload.delete_file);
router.get("/getFile", upload.get_file_by_name);

module.exports = router;
