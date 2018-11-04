import Student from '../models/students.model'
import Course from '../models/courses.model'
import logger from '../core/logger/app-logger'
import mongoose from 'mongoose';

const controller = {};

controller.getAll = async (req, res) => {
    try {
        const students = await Student.getAll();
        logger.info('sending all students...');
        res.send(students);
    }
    catch (err) {
        logger.error('Error in getting students- ' + err);
        res.send('Got error in getAll');
    }
}

controller.addStudent = async (req, res) => {
    let studentToAdd = Student({
        name: req.body.name
    });
    try {
        const savedStudent = await Student.addStudent(studentToAdd);
        logger.info('Adding student...');
        res.send('added: ' + savedStudent);
    }
    catch (err) {
        logger.error('Error in adding student- ' + err);
        res.send('Got error in addStudent');
    }
}

controller.deleteStudent = async (req, res) => {
    let studentId = req.body._id;
    try {
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            logger.info(`provided id:${studentId} not valid ObjectId`);
            res.send('Not Valid ObjectId');
        }
        else {
            const findStudent = await Student.getById(studentId);

            if (!findStudent) {
                logger.info(`Student with id:${studentId} not found`);
                res.send('Student not found');
            }
            else {
                const removedStudent = await Student.removeStudent(studentId);
                logger.info('Deleted Student- ' + removedStudent);
                res.send('Student successfully deleted');
            }
        }
    }
    catch (err) {
        logger.error('Failed to delete student- ' + err);
        res.send('Got error in deleteStudent');
    }
}

controller.assignCourse = async (req, res) => {
    let studentId = req.body.studentId;
    let courseId = req.body.courseId;

    try {
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            logger.info(`provided id:${studentId} not valid ObjectId`);
            res.send('Not Valid ObjectId');
        }
        else {
            const findStudent = await Student.getById(studentId);

            if (!findStudent) {
                logger.info(`Student with id:${studentId} not found`);
                res.send('Student not found');
            }
            else {

                logger.info(studentId);

                const findCourse = await Course.getById(courseId);
                if (!findCourse) {
                    logger.info(`Course with id:${courseId} not found`);
                    res.send('Course not found');
                }
                else {
                    findStudent.courses.push({
                        courseId: findCourse._id
                    })
                    findStudent.save();
                    res.send('added: ' + findStudent);
                }
            }
        }
    }
    catch (err) {
        logger.error('Failed to delete student- ' + err);
        res.send('Got error in assignCourse');
    }
}

controller.assignScore = async (req, res) => {

    let studentId = req.body.studentId;
    let courseId = req.body.courseId;
    let score = req.body.score;

    try {
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            logger.info(`provided id:${studentId} not valid ObjectId`);
            res.send('Not Valid ObjectId');
        }
        else {
            await Student.update({ "_id": studentId, "courses.courseId": new mongoose.Types.ObjectId(courseId) },
                { $set: { "courses.$.score": score } })

            res.send('added: ');
        }
    }
    catch (err) {
        logger.error('Failed to delete student- ' + err);
        res.send('Got error in assignCourse');
    }
}

controller.outstanding = async (req, res) => {
    try {
        const students = await Student.getAll();
        let outstanding = [];

        students.forEach(function (student) {

            let sumScore = 0;
            let countEndedCorses = 0;

            student.courses.forEach(function (course) {
                sumScore += course.score ? course.score : 0;
                countEndedCorses += course.score ? 1 : 0;
            });

            const avg = sumScore / countEndedCorses;

            if (avg >= 90) {
                outstanding.push({
                    name: student.name,
                    avg: avg
                })
            }
        });

        logger.info('sending all students...');
        res.send(outstanding);
    }
    catch (err) {
        logger.error('Error in getting students- ' + err);
        res.send('Got error in getAll');
    }
}

export default controller;