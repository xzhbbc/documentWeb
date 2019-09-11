const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')

const User = mongoose.model('User')

const Department = mongoose.model('Department')

//检查密码是否正确
const checkPwd = async (user, pwd, fix) => {
    let match = false
    let fixPwd = ''
    const userCheck = await User.findOne({
        user
    }).populate('Department', 'name')

    if (!userCheck.status) {
        return {
            match: false,
            stop: true,
        }
    }
    // console.log(userCheck)
    if (userCheck) {
        match = await userCheck.comparepwd(pwd, userCheck.pwd)
        if (fix&&match) {
            fixPwd = await userCheck.bcrCode(fix)
        }
        return {
            match,
            user: userCheck,
            fixPwd
        }
    } else {
        return {
            match
        }
    }
}

//登录
router.post('/loginUser', async (req, res) => {
    let {
        user,
        pwd
    } = req.body
    // console.log(user, pwd)
    const check = await checkPwd(user, pwd)

    if (check.match) {
        // console.log(check.user)
        check.user.pwd = ''
        res.cookie('userid', check.user._id)
        return res.json({
            code: 1,
            data: check.user
        })
    } else {
        if (check.stop) {
            return res.json({
                code: 0,
                msg: '该账户已停用，请与管理员联系!',
                data: ''
            })
        } else {
            return res.json({
                code: 0,
                msg: '用户名或密码错误!',
                data: ''
            })
        }

    }
})

//注册
router.post('/registerUser', async (req, res) => {
    let {
        user,
        pwd,
        tel,
        email,
        department,
    } = req.body

    let findSameUser = await User.findOne({
        user
    })

    let findDepartment = await Department.findOne({
        _id: department
    })

    if (!findDepartment) {
        return res.json({
            code: 0,
            msg: '部门参数错误!',
            data: ''
        })
    }



    if (!findSameUser) {
        const useSave = new User({
            user,
            pwd,
            tel,
            Department: department,
            email,
        })

        let save = await useSave.save()
        if (save._id) {
            save.pwd = ''
            res.cookie('userid', save._id)
            save.Department = findDepartment
            return res.json({
                code: 1,
                msg: '注册成功！',
                data: save
            })
        } else {
            return res.json({
                code: 0,
                msg: '数据库存储错误!',
                data: ''
            })
        }
    } else {
        return res.json({
            code: 0,
            msg: '该用户已经注册了!',
            data: ''
        })
    }
})

router.post('/fixCode', async (req, res) => {
    let {old, pwd, user} = req.body

    const check = await checkPwd(user, old, pwd)
    if (check.match) {
        let updateData = await User.updateOne({
            user,
        }, {
            $set: {pwd: check.fixPwd}
        })

        if (updateData.ok) {
            res.cookie('userid', '')
            return res.json({
                code: 1,
                msg: '修改成功，需要重新登录',
                data: 1,
            })
        } else {
            return res.json({
                code: 0,
                msg: '修改失败'
            })
        }
    } else {
        return res.json({
            code: 0,
            msg: '旧密码填写错误'
        })
    }
})


//檢查是否在登陸
router.get('/loginStatus', async (req, res) => {
    const userid = req.cookies.userid

    if (!userid) {
        //未登陸
        return res.json({
            data: {},
            code: 1,
        })
    } else {
        let findUser = await User.findOne({
            _id: userid
        }).populate('Department', 'name')

        if (!findUser) {
            return res.json({
                code: 1,
                data: {},
                msg: '未找到該用戶'
            })
        } else {
            return res.json({
                code: 1,
                data: findUser
            })
        }
    }
})

router.get('/logout', async (req, res) => {
    res.cookie('userid', '')

    return res.json({
        code: 1,
        msg: '退出成功'
    })
})

module.exports = router