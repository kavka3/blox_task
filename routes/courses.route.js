import express from "express";
import courseController from "../controllers/courses.controller"
const router = express.Router()

router.get('/allcourses', (req, res) => {
    courseController.getAll(req, res);
});

router.post('/addcourse', (req, res) => {
    courseController.addCourse(req, res);
});

router.delete('/deletecourse', (req, res) => {
    courseController.deleteCourse(req, res);
});

export default router;