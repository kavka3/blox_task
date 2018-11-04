import express from "express";
import studentController from "../controllers/students.controller"
const router = express.Router()

router.get('/allstudents', (req, res) => {
    studentController.getAll(req, res);
});

router.post('/addstudent', (req, res) => {
    studentController.addStudent(req, res);
});

router.post('/assigncourse', (req, res) => {
    studentController.assignCourse(req, res);
});

router.post('/assignscore', (req, res) => {
    studentController.assignScore(req, res);
});

router.get('/outstanding', (req, res) => {
    studentController.outstanding(req, res);
});

router.delete('/deletestudent', (req, res) => {
    studentController.deleteStudent(req, res);
});

export default router;