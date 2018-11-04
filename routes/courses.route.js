import express from "express";
import courseController from "../controllers/courses.controller"
const router = express.Router()

router.get('/', (req, res) => {
    courseController.getAll(req, res);
});

router.get('/:id', (req, res) => {
    courseController.getById(req, res);
});

router.post('/', (req, res) => {
    courseController.addCourse(req, res);
});

router.put('/:id', (req, res) => {
    courseController.updateCourse(req, res);
});

router.delete('/:id', (req, res) => {
    courseController.deleteCourse(req, res);
});

export default router;