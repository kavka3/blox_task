import Course from '../models/courses.model'
import logger from '../core/logger/app-logger'
import mongoose from 'mongoose';

const controller = {};

controller.getAll = async (req, res) => {
    try {
        const courses = await Course.getAll();
        logger.info('sending all courses...');
        res.send(courses);
    }
    catch (err) {
        logger.error('Error in getting courses- ' + err);
        res.send('Got error in getAll');
    }
}

controller.addCourse = async (req, res) => {
    let courseToAdd = Course({
        name: req.body.name
    });
    try {
        const savedCourse = await Course.addCourse(courseToAdd);
        logger.info('Adding course...');
        res.send('added: ' + savedCourse);
    }
    catch (err) {
        logger.error('Error in adding course- ' + err);
        res.send('Got error in addCourse');
    }
}

controller.deleteCourse = async (req, res) => {
    let courseId = req.body._id;
    try {
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            logger.info(`provided id:${courseId} not valid ObjectId`);
            res.send('Not Valid ObjectId');
        }
        else {
            const findCourse = await Course.getById(courseId);

            if (!findCourse) {
                logger.info(`Course with id:${courseId} not found`);
                res.send('Course not found');
            }
            else {
                const removedCourse = await Course.removeCourse(courseId);
                logger.info('Deleted Course- ' + removedCourse);
                res.send('Course successfully deleted');
            }
        }
    }
    catch (err) {
        logger.error('Failed to delete course- ' + err);
        res.send('Got error in deleteCourse');
    }
}

export default controller;