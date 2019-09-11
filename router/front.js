const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')

const Department = mongoose.model('Department')

const Content = mongoose.model('Content')

//设定每次请求的页数
let pageNum = 10

//获取部门信息
router.get('/getDepartment', async (req, res) => {
    let data = await Department.find({})

    if (data) {
        return res.json({
            code: 1,
            data: data
        })
    }
})

//获取所有文章信息  --- 分页
//根据部门来获取文章
router.get('/getContent', async (req, res) => {
    let {id, page} = req.query
    let data;
    if (!page) {
        page = 1
    }
    let skip = (page - 1) * pageNum
    let getCount = 0
    if (id) {
        data = await Content.find({
            Department: id
        }).sort({create_time: -1}).skip(skip).limit(pageNum).populate('Department create_user', 'name user')
        getCount = await Content.countDocuments({
            Department: id
        })
    } else {
        data = await Content.find({}).sort({create_time: -1}).skip(skip).limit(pageNum).populate('Department create_user', 'name user')
        getCount = await Content.countDocuments({})
    }
    //计算总页数
    let allPage = Math.ceil(getCount / pageNum)
    if (data) {
        return res.json({
            code: 1,
            data,
            page: allPage
        })
    }
})

//获取文章详情
router.get('/getContentOne', async (req, res) => {
    let {id} = req.query

    let data = await Content.findOne({
        _id: id
    }).populate('Department create_user', 'name user')

    if (data._id) {
        return res.json({
            code: 1,
            data
        })
    } else {
        return res.json({
            code: 0,
            msg: '未找到该文章'
        })
    }
})

//查找文章
router.post('/findContent', async (req, res) => {
    let {search} = req.body
    let reg = ''
    if (search&&search!='') {
        reg = new RegExp(search)
    }
    if (reg == '') {
        return res.json({
            code: 0,
            msg: '請輸入一個關鍵詞！'
        })
    }

    const content = await Content.find({
        // htmlContent: reg
        $or: [
            {title: {$regex : reg}},
            {htmlContent: {$regex : reg}}
        ]
    }, 'title htmlContent create_time')

    // console.log(content)
    return res.json({
        code: 1,
        data: content
    })
})

module.exports = router