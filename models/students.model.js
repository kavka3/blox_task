import mongoose from 'mongoose';

const StudentSchema = mongoose.Schema({
    name: { type: String, required: true, index: true },
    courses: {type: [{
        courseId: mongoose.Types.ObjectId,
        score: Number
    }]},
    createdDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now }
}, { collection: 'Student' });

let StudentsModel = mongoose.model('Student', StudentSchema);

StudentsModel.getById = (studentId) => {
    return StudentsModel.findById(studentId);
}

StudentsModel.getAll = () => {
    return StudentsModel.find({});
}

StudentsModel.addStudent = (studentToAdd) => {
    return studentToAdd.save();
}

StudentsModel.removeStudent = (studentId) => {
    return StudentsModel.findByIdAndRemove(studentId);
}

export default StudentsModel;