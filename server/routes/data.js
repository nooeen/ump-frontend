const dataController = require('../controllers/dataController');
const express = require("express");
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'./public/uploads');
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  }
});

const uploads = multer({storage:storage});

router.get('/api/data/import', dataController.import);
router.post('/api/data/importdata', uploads.single('csv'), dataController.importData);
router.get('/api/data/export', dataController.export);
router.post('/api/data/exportdata', dataController.exportData);

module.exports = router;
