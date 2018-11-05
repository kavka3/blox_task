import Course from '../models/courses.model'
import logger from '../core/logger/app-logger'

const controller = {};

controller.getAll = async (req, res) => {
    try {
        const courses = await Course.getAll();
        logger.info('sending all courses...');
        res.send(courses);
    }
    catch (err) {
        logger.error(`Error in getting courses- ${err}`);
        res.send('Got error in getAll');
    }
}

controller.getById = async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await Course.findById(courseId)
        logger.info(`Get course by id: ${courseId}`);
        res.send(course);
    }
    catch (err) {
        logger.error(`Error in getting course- ${err}`);
        res.send('Got error in getById');
    }
}

controller.addCourse = async (req, res) => {
    let courseToAdd = Course({
        name: req.body.name
    });
    try {
        const savedCourse = await Course.addCourse(courseToAdd);
        logger.info('Adding course...');
        res.send(savedCourse);
    }
    catch (err) {
        logger.error(`Error in adding course- ${err}`);
        res.send('Got error in addCourse');
    }
}

controller.updateCourse = async (req, res) => {
    const courseId = req.params.id;
    try {

        const findCourse = await Course.getById(courseId);

        if (!findCourse) {
            logger.info(`Course with id:${courseId} not found`);
            res.send('Course not found');
        }
        else {
            Object.assign(findCourse, req.body);
            await findCourse.save();
            logger.info(`Update Course- ${findCourse}`);
            res.send('Course successfully updated');
        }
    }
    catch (err) {
        logger.error(`Failed to update course- ${err}`);
        res.send('Got error in updateCourse');
    }
}

controller.deleteCourse = async (req, res) => {
    let courseId = req.params.id;
    try {

        const findCourse = await Course.getById(courseId);

        if (!findCourse) {
            logger.info(`Course with id:${courseId} not found`);
            res.send('Course not found');
        }
        else {
            const removedCourse = await Course.removeCourse(courseId);
            logger.info(`Deleted Course- ${removedCourse}`);
            res.send('Course successfully deleted');
        }
    }
    catch (err) {
        logger.error(`Failed to delete course- ${err}`);
        res.send('Got error in deleteCourse');
    }
}

export default controller;