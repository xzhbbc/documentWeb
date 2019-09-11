const mongoose = require('mongoose')

const Department = new mongoose.Schema({
    //部门名
    name: {
      type: String,
      require: true
    },
    //封面
    img: {
        type: String,
        default: null
    }
})

mongoose.model('Department', Department)