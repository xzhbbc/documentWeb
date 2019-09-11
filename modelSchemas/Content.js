const mongoose = require('mongoose')

const Content = new mongoose.Schema({
    //所属部门
    Department: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department'
    },
    //创建的用户
    create_user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    //markdown内容
    markDown: {
        type: String
    },
    //html内容
    htmlContent: {
        type: String,
        required: true,
    },
    create_time: {
        type: Number,
        default: new Date().getTime()
    },
    //标题
    title: {
        type: String,
        required: true,
    },
    //所属类别
    tags: {
        type: String
    },
    //文本路径 --- word pdf excel
    file: {
        type: String
    }
})

mongoose.model('Content', Content)