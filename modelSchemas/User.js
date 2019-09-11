const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const SALT_WORK_FACTOR = 10

//用户表结构
const User = new mongoose.Schema({
    //用户名
    user: {
        type: String,
        require: true
    },
    //密码
    pwd: {
        type: String,
        require: true
    },
    //邮箱
    email: {
        type: String,
        default: null
    },
    //手机
    tel: {
        type: String,
        default: null
    },
    create_time: {
        type: Number,
        default: new Date().getTime()
    },
    last_time: {
        type: Number
    },
    //true为管理员, false 为普通用户
    admin: {
        type: Boolean,
        required: true,
        default: false,
    },
    //所属部门
    Department: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department'
    },
    //1--负责人  2--部门人员  3--访客
    power: {
        type: Number,
        default: 3
    },
    //true表示可用，false表示不可用用户  --- 是否停用
    status: {
        type: Boolean,
        required: true,
        default: true
    }
})

//密码加严
User.pre('save', function (next) {
    //this.isModified('pwd') mongdb自带的方法，查看某个字段是否被更改
    //如果是没更改，就跳过这个加严环节(即密码有所变化的时候，做出更改加严)
    if (!this.isModified('pwd')) return next()

    //SALT_WORK_FACTOR长度，这个变量数值越大，构建出来的salt越复杂，需要的计算量越大
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err)

        //拿到salt，再来进行hash加密
        bcrypt.hash(this.pwd, salt, (err, hash) => {
            if (err) return next(err)

            this.pwd = hash

            next()
        })
    })
})

User.methods = {
    //比对密码是否正确
    comparepwd: (_pwd, pwd) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_pwd, pwd, (err, isMatch) => {
                if (!err) resolve(isMatch)
                else reject(err)
            })
        })
    },
    bcrCode: (pwd) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
                if (err) return reject(err)

                //拿到salt，再来进行hash加密
                bcrypt.hash(pwd, salt, (err, hash) => {
                    if (err) return reject(err)

                    pwd = hash

                    resolve(pwd)
                })
            })
        })
    }
}

mongoose.model('User', User)