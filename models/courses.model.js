import mongoose from 'mongoose';

const CourseSchema = mongoose.Schema({
    name: { type: String, required: true, index: true },
    createdDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now }
}, { collection: 'Course' });

let CoursesModel = mongoose.model('Course', CourseSchema);

CoursesModel.getById = (courseId) => {
    return CoursesModel.findById(courseId);
}

CoursesModel.getAll = () => {
    return CoursesModel.find({});
}

CoursesModel.addCourse = (courseToAdd) => {
    return courseToAdd.save();
}

CoursesModel.removeCourse = (courseId) => {
    return CoursesModel.findByIdAndRemove(courseId);
}

export default CoursesModel;