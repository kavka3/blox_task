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
        logger.error(`Error in getting students- ${err}`);
        res.send('Got error in getAll');
    }
}

controller.getById = async (req, res) => {
    const studentId = req.params.id;
    try {
        const student = await Student.findById(studentId)
        logger.info(`Get student by id: ${studentId}`);
        res.send(student);
    }
    catch (err) {
        logger.error('Error in getting student- ' + err);
        res.send('Got error in getById');
    }
}

controller.addStudent = async (req, res) => {
    let studentToAdd = Student({
        name: req.body.name
    });
    try {
        const savedStudent = await Student.addStudent(studentToAdd);
        logger.info('Adding student...');
        res.send(savedStudent);
    }
    catch (err) {
        logger.error(`Error in adding student- ${err}`);
        res.send('Got error in addStudent');
    }
}

controller.updateStudent = async (req, res) => {
    const studentId = req.params.id;
    try {

        const findStudent = await Student.getById(studentId);

        if (!findStudent) {
            logger.info(`Student with id:${studentId} not found`);
            res.send('Student not found');
        }
        else {
            Object.assign(findStudent, req.body);
            await findStudent.save();
            logger.info(`Update Student- ${findStudent}`);
            res.send('Student successfully updated');
        }
    }
    catch (err) {
        logger.error(`Failed to update student- ${err}`);
        res.send('Got error in updateStudent');
    }
}

controller.deleteStudent = async (req, res) => {
    const studentId = req.params.id;
    try {

        const findStudent = await Student.getById(studentId);

        if (!findStudent) {
            logger.info(`Student with id:${studentId} not found`);
            res.send('Student not found');
        }
        else {
            const removedStudent = await Student.removeStudent(studentId);
            logger.info(`Deleted Student- ${removedStudent}`);
            res.send('Student successfully deleted');
        }
    }
    catch (err) {
        logger.error('Failed to delete student- ' + err);
        res.send('Got error in deleteStudent');
    }
}

controller.assignCourse = async (req, res) => {
    const studentId = req.body.studentId;
    const courseId = req.body.courseId;
    try {
        const findStudent = await Student.getById(studentId);
        if (!findStudent) {
            logger.info(`Student with id:${studentId} not found`);
            res.send('Student not found');
        }

        const findCourse = await Course.getById(courseId);
        if (!findCourse) {
            logger.info(`Course with id:${courseId} not found`);
            res.send('Course not found');
        }

        findStudent.courses.push({
            courseId: findCourse._id
        })
        await findStudent.save();
        res.send(findStudent);
    }
    catch (err) {
        logger.error(`Failed to assign course- ${err}`);
        res.send('Got error in assignCourse');
    }
}

controller.assignScore = async (req, res) => {
    const studentId = req.body.studentId;
    const courseId = req.body.courseId;
    const score = req.body.score;
    try {

        if (isNaN(Math.trunc(score))) {
            logger.info(`Score is not a number`);
            res.send('Score is not a number');
        }

        if (!score && !isNaN(Math.trunc(score))) {
            logger.info(`Score undefined`);
            res.send('Score undefined');
        }

        const findStudent = await Student.getById(studentId);
        if (!findStudent) {
            logger.info(`Student with id:${studentId} not found`);
            res.send('Student not found');
        }

        const findCourse = await Course.getById(courseId);
        if (!findCourse) {
            logger.info(`Course with id:${courseId} not found`);
            res.send('Course not found');
        }

        await Student.updateOne({ "_id": studentId, "courses.courseId": new mongoose.Types.ObjectId(courseId) },
            { $set: { "courses.$.score": Math.trunc(score) } })

        res.send(`added score: ${score} to courseId: ${courseId}`);
    }
    catch (err) {
        logger.error(`Failed to assign score- ${err}`);
        res.send('Got error in assignScore');
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

            logger.info(`sumscore: ${sumScore}, countEndedCorses: ${countEndedCorses}`);

            const avg = countEndedCorses != 0 ? sumScore / countEndedCorses : 0;

            if (avg >= 90) {
                outstanding.push({
                    name: student.name,
                    avg: avg
                })
            }
        });

        res.send(outstanding);
    }
    catch (err) {
        logger.error(`Error in outstanding- ${err}`);
        res.send('Got error in outstanding');
    }
}

export default controller;