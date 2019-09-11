const mongoose = require('mongoose')
const db = 'mongodb://localhost:27018/document'

const glob = require('glob')
const {
    resolve
} = require('path')

exports.initSchemas = () => {
    glob.sync(resolve(__dirname, '../modelSchemas/', '**/*.js')).forEach(require)
}

//初始化部门
exports.initDepartment = async () => {
    const Department = mongoose.model('Department')

    let findDepartment = await Department.findOne({
        name: '研发部'
    })

    if (!findDepartment) {
        const department = new Department({
            name: '研发部',
        })
        await department.save()
    }
}

//初始化管理员账号
exports.initAdmin = async () => {
    const Department = mongoose.model('Department')
    const User = mongoose.model('User')

    let findDepartment = await Department.findOne({
        name: '研发部'
    })

    if (findDepartment) {
        let adminCheck = await User.findOne({
            user: 'admin'
        })

        if (!adminCheck) {
            const user = new User({
                user: 'admin',
                pwd: 'a123',
                tel: '13824240452',
                email: '511369429@qq.com',
                Department: findDepartment._id,
                power: '1',
                admin: true
            })

            await user.save()
        }
    }
}

exports.connect = () => {
    let maxConTimes = 0

    return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true)
        }

        mongoose.connect(db, {
            useNewUrlParser: true
        })

        mongoose.connection.on('disconnected', () => {
            maxConTimes++
            if (maxConTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了')
            }
        })
        mongoose.connection.on('error', err => {
            maxConTimes++
            if (maxConTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了')
            }
        })

        mongoose.connection.once('open', () => {
            resolve()
            console.log('Mongodb Connected Success')
        })
    })
}