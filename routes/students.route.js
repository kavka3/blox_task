import express from "express";
import studentController from "../controllers/students.controller"
const router = express.Router()

router.get('/', (req, res) => {
    studentController.getAll(req, res);
});

router.get('/:id', (req, res) => {
    studentController.getById(req, res);
});

router.post('/', (req, res) => {
    studentController.addStudent(req, res);
});

router.put('/:id', (req, res) => {
    studentController.updateStudent(req, res);
});

router.delete('/:id', (req, res) => {
    studentController.deleteStudent(req, res);
});

router.post('/assigncourse', (req, res) => {
    studentController.assignCourse(req, res);
});

router.post('/assignscore', (req, res) => {
    studentController.assignScore(req, res);
});

router.post('/outstanding', (req, res) => {
    studentController.outstanding(req, res);
});

export default router;