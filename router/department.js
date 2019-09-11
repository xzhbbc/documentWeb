const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')

const Department = mongoose.model('Department')
const User = mongoose.model('User')

//上传文件操作
const fs = require('fs');
const forms = require('formidable');

let userMeg = {}
router.use(async function (req, res, next) {
    const userid = req.cookies.userid

    if (!userid) {
        return res.json({
            code: -1,
            msg: '非法操作'
        })
    } else {
        let findUser = await User.findOne({
            _id: userid
        })

        if (!findUser) {
            return res.json({
                code: -1,
                msg: '非法操作'
            })
        } else {
            userMeg = findUser
        }
    }
    next()
})

//录入部门(无图)  -- 修改
router.post('/set', async (req, res) => {
    let {name, id} = req.body
    if (!userMeg.admin) {
        return res.json({
            code: 0,
            msg: '你没有权限！'
        })
    }

    if (name != '') {

        const findDepartment = await Department.findOne({
            name
        })
        // console.log(findDepartment)
        if (!findDepartment||id) {
            if (id) {
                //修改
                let updateData = await Department.updateOne({
                    _id: id,
                }, {
                    $set: {name}
                })

                if (updateData.ok) {
                    return res.json({
                        code: 1,
                        msg: '修改成功！'
                    })
                } else {
                    return res.json({
                        code: 0,
                        msg: '修改失败'
                    })
                }
            } else {
                //保存
                const department = new Department({
                    name
                })
                let save = await department.save()
                if (save._id) {
                    return res.json({
                        code: 1,
                        msg: '保存成功！'
                    })
                } else {
                    return res.json({
                        code: 0,
                        msg: '保存失败！'
                    })
                }
            }
        } else {
            return res.json({
                code: 0,
                msg: '已经存在该部门！'
            })
        }
    }

})

//录入部门 -- 修改 （带图片）
router.post('/setPhoto', async (req, res) => {

    if (!userMeg.admin) {
        return res.json({
            code: 0,
            msg: '你没有权限！'
        })
    }

    let form = new forms.IncomingForm(); //创建上传表单
    form.uploadDir = './views/static/upload'; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

    form.parse(req, async (err, fields, files) => {
        let {name, id} = fields
        //   if (err) {
        //     res.locals.error = err;
        //     res.render('index', {
        //       title: TITLE
        //     });
        //     return;
        //   }

        var extName = 'png'; //后缀名
        switch (files.file.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if (extName.length == 0) {
            res.locals.error = '只支持png和jpg格式图片';
            return;
        }
        //显示地址；
        var showUrl = files.file.path;

        const findDepartment = await Department.findOne({
            name
        })
        if (!id) {
            if (findDepartment) {
                fs.unlink(showUrl, function() {})
                return res.json({
                    code: 0,
                    meg: '已经存在该部门！'
                })
            }
        }


        if (showUrl) {
            if (id) {
                let updateData = await Department.updateOne({
                    _id: id,
                }, {
                    $set: {name, img: showUrl}
                })

                if (updateData.ok) {
                    //删除之前保存的照片
                    fs.unlink(findDepartment.img, function() {})
                    return res.json({
                        code: 1,
                        msg: '修改成功！'
                    })
                } else {
                    fs.unlink(showUrl, function() {})
                    return res.json({
                        code: 0,
                        msg: '修改失败'
                    })
                }
            } else {
                const photo = new Department({
                    name,
                    img: showUrl,
                })
                let save = await photo.save()
                if (save._id) {
                    return res.json({
                        code: 1,
                        msg: '保存成功！'
                    })
                } else {
                    fs.unlink(showUrl, function() {})
                    return res.json({
                        code: 0,
                        meg: '上传失败！'
                    })
                }
            }
        } else {
            fs.unlink(showUrl, function() {})
            return res.json({
                code: 0,
                meg: '上传失败！'
            })
        }
    })


})

//获取部门
router.get('/get', async (req, res) => {

    let {id} = req.query

    if (userMeg.admin) {
        let data = ''
        if (id) {
            data = await Department.findOne({
                _id: id
            })
        } else {
            data = await Department.find({})
        }

        if (data) {
            return res.json({
                code: 1,
                data: data
            })
        } else {
            return res.json({
                code: 0,
                msg: '未找到部门数据'
            })
        }
    } else {
        return res.json({
            code: 0,
            msg: '你没有权限！'
        })
    }
})

//删除部门
router.post('/remove', async (req, res) => {
    let {id} = req.body

    if (userMeg.admin) {
        let delData = await Department.remove({
            _id: id
        })

        if (delData.ok == 1) {
            return res.json({
                code: 1,
                msg: '删除成功',
            })
        } else {
            return res.json({
                code: 0,
                msg: '删除失败',
            })
        }
    } else {
        return res.json({
            code: 0,
            msg: '你没有权限！'
        })
    }
})

//开启-停用用户
router.post('/stopMember', async (req, res) => {
    let {id, status} = req.body

    if (userMeg.power||userMeg.power == 1) {
        let updateData = await User.updateOne({
            _id: id,
        }, {
            $set: {status: status}
        })


        if (updateData.ok) {
            return res.json({
                code: 1,
                msg: '修改成功！'
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
            msg: '你没有权限！'
        })
    }
})

//修改部门用户身份
router.post('/fixPower', async (req, res) => {
    let {id, power} = req.body

    if (userMeg.power||userMeg.power == 1) {
        let updateData = await User.updateOne({
            _id: id,
        }, {
            $set: {power}
        })


        if (updateData.ok) {
            return res.json({
                code: 1,
                msg: '修改成功！'
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
            msg: '你没有权限！'
        })
    }
})

//获取成员
router.get('/getMember', async (req, res) => {
    // console.log(userMeg)
    if (userMeg.admin||userMeg.power < 2) {
        if (userMeg.admin) {
            let users = await User.find({
                _id: {'$ne': userMeg._id}
            }, 'email tel create_time power status user Department').populate('Department', 'name')

            if (users&&users.length!=0) {
                return res.json({
                    code: 1,
                    data: users
                })
            } else {
                return res.json({
                    code: 0,
                    msg: '暂时未有用户！'
                })
            }
        }
        if (userMeg.power == 1) {
            let users = await User.find({
                $and: [
                    {_id: {'$ne': userMeg._id}},
                    {Department: userMeg.Department}
                ]
            }, 'email tel create_time power status user Department').populate('Department', 'name')

            if (users&&users.length!=0) {
                return res.json({
                    code: 1,
                    data: users
                })
            } else {
                return res.json({
                    code: 0,
                    msg: '暂时未有用户！'
                })
            }
        }
    } else {
        return res.json({
            code: 0,
            msg: '你没有权限！'
        })
    }
})

//停用-开启成员
router.post('/stopman', async (req, res) => {
    let {id, status} = req.body

    if (status == 0) {
        status = 1
    } else {
        status = 0
    }


    if (userMeg.power == 1) {
        let updateData = await User.updateOne({
            _id: id,
        }, {
            $set: {status: status}
        })


        if (updateData.ok) {
            return res.json({
                code: 1,
                msg: '修改成功！'
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
            msg: '你没有权限！'
        })
    }
})


module.exports = router