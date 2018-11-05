import Student from '../models/students.model'
import Course from '../models/courses.model'
import logger from '../core/logger/app-logger'

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
        if (!findStudent)
            logger.info(`Student with id:${studentId} not found`);

        const findCourse = await Course.getById(courseId);
        if (!findCourse)
            logger.info(`Course with id:${courseId} not found`);

        const updatedStudent = await Student.findOneAndUpdate({ _id: findStudent._id },
            { $push: { courses: { courseId: findCourse._id } } },
            { new: true });

        res.send(updatedStudent);
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
        
        const findStudent = await Student.getById(studentId);
        if (!findStudent)
            logger.info(`Student with id:${studentId} not found`);

        const findCourse = await Course.getById(courseId);
        if (!findCourse)
            logger.info(`Course with id:${courseId} not found`);

        const updatedStudent = await Student.findOneAndUpdate({ _id: findStudent._id, "courses.courseId": findCourse._id },
            { $set: { "courses.$.score": score } },
            { new: true });

        res.send(updatedStudent);
    }
    catch (err) {
        logger.error(`Failed to assign score- ${err}`);
        res.send('Got error in assignScore');
    }
}

controller.outstanding = async (req, res) => {
    try {
        const outstanding = await Student.aggregate([
            { $unwind: '$courses' },
            { $group: { _id: '$_id', name: { $first: '$name' }, avg: { $avg: '$courses.score' } } },
            { $match: { 'avg': { $gt: 89 } } }
        ]);

        res.send(outstanding);
    }
    catch (err) {
        logger.error(`Error in outstanding- ${err}`);
        res.send('Got error in outstanding');
    }
}

controller.mokeData = async (req, res) => {
    try {

        let test1 = await Student.addStudent(Student({ name: "Test1" }));
        let test2 = await Student.addStudent(Student({ name: "Test2" }));
        let test3 = await Student.addStudent(Student({ name: "Test3" }));

        let course1 = await Course.addCourse(Course({ name: "Course1" }));
        let course2 = await Course.addCourse(Course({ name: "Course2" }));
        let course3 = await Course.addCourse(Course({ name: "Course3" }));

        test1 = await Student.findOneAndUpdate({ _id: test1._id },
            { $push: { courses: { courseId: course1._id } } },
            { new: true });

        test1 = await Student.findOneAndUpdate({ _id: test1._id },
            { $push: { courses: { courseId: course2._id } } },
            { new: true });

        test1 = await Student.findOneAndUpdate({ _id: test1._id },
            { $push: { courses: { courseId: course3._id } } },
            { new: true });


        test2 = await Student.findOneAndUpdate({ _id: test2._id },
            { $push: { courses: { courseId: course1._id } } },
            { new: true });

        test2 = await Student.findOneAndUpdate({ _id: test2._id },
            { $push: { courses: { courseId: course3._id } } },
            { new: true });


        test3 = await Student.findOneAndUpdate({ _id: test3._id },
            { $push: { courses: { courseId: course2._id } } },
            { new: true });

        test3 = await Student.findOneAndUpdate({ _id: test3._id },
            { $push: { courses: { courseId: course3._id } } },
            { new: true });

        test1 = await Student.findOneAndUpdate({ _id: test1._id, "courses.courseId": course1._id },
            { $set: { "courses.$.score": 89 } },
            { new: true });

        test1 = await Student.findOneAndUpdate({ _id: test1._id, "courses.courseId": course2._id },
            { $set: { "courses.$.score": 91 } },
            { new: true });


        test2 = await Student.findOneAndUpdate({ _id: test2._id, "courses.courseId": course1._id },
            { $set: { "courses.$.score": 77 } },
            { new: true });
        test2 = await Student.findOneAndUpdate({ _id: test2._id, "courses.courseId": course3._id },
            { $set: { "courses.$.score": 95 } },
            { new: true });


        test3 = await Student.findOneAndUpdate({ _id: test3._id, "courses.courseId": course3._id },
            { $set: { "courses.$.score": 100 } },
            { new: true });

        res.send('moke data');
    }
    catch (err) {
        logger.error(`Error in mokedata- ${err}`);
        res.send('Got error in mokeData');
    }
}

export default controller;