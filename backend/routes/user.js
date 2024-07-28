const express = require('express');
const router = express.Router();
const { User } = require("../db");
const zod = require('zod');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use a unique filename
    }
});
const upload = multer({ storage: storage });

const loginBody = zod.object({
    employeName: zod.string(),
    employeId: zod.string()
});

router.post("/login", async (req, res) => {
    const parseResult = loginBody.safeParse(req.body);
    if (!parseResult.success) {
        return res.status(400).json({
            message: "Invalid inputs"
        });
    }

    try {
        const user = await User.findOne({
            employeName: req.body.employeName,
            employeId: req.body.employeId
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Login successful",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: "Error while logging in",
            error: error.message
        });
    }
});

// New endpoint to handle PDF file uploads
router.post("/upload-pdf", upload.single('pdfFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    res.status(200).json({
        message: "File uploaded successfully",
        file: req.file
    });
});

module.exports = router;
