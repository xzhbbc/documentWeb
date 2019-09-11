const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')

const User = mongoose.model('User')
const Content = mongoose.model('Content')

//上传文件操作
const fs = require('fs');
const forms = require('formidable');
const mammoth = require("mammoth")
const PDFParser = require("pdf2json");
const xlsToJson = require("xls-to-json");

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

//保存markdown
router.post('/saveMarkdown', async (req, res) => {
    let {markDown, htmlContent, title, tags} = req.body

    if (userMeg.power < 3) {
        const content = Content({
            markDown,
            htmlContent,
            title,
            tags,
            Department: userMeg.Department,
            create_user: userMeg._id,
            file: ''
        })

        let save = await content.save()

        if (save._id) {
            return res.json({
                code: 1,
                msg: '保存成功！',
                data: '',
            })
        } else {
            return res.json({
                code: 0,
                msg: '保存失败！'
            })
        }
    } else {
        return res.json({
            code: 0,
            msg: '你没有权限！'
        })
    }
})


// 后续优化，将自己发布 与 别人发布的区分开来
router.get('/getContent', async (req, res) => {

    if (userMeg.admin) {
        //管理员  --- 管理所有文章
        const content = await Content.find({}).populate('Department create_user', 'name user')

        return res.json({
            code: 1,
            data: content
        })
    }

    if (userMeg.power == 1) {
        //负责人 -- 可以看和修改对应部门的文章
        const content = await Content.find({
            Department: userMeg.Department
        }).populate('Department create_user', 'name user')

        return res.json({
            code: 1,
            data: content
        })
    } else {
        const content = await Content.find({
            create_user: userMeg._id
        }).populate('Department create_user', 'name user')

        return res.json({
            code: 1,
            data: content
        })
    }
})

//查找某篇文章，用于编辑
router.post('/getOneContent', async (req, res) => {
    let {id} = req.body

    if (id) {
        let content = ''
        if (userMeg.admin) {
            content = await Content.findOne({
                _id: id
            })
        } else if (userMeg.power == 1) {
            content = await Content.findOne({
                _id: id,
                Department: userMeg.Department
            })
        } else {
            content = await Content.findOne({
                _id: id,
                create_user: userMeg._id
            })
        }

        if (content) {
            return res.json({
                code: 1,
                data: content
            })
        } else {
            return res.json({
                code: 0,
                msg: '未找到该文章或者您没有编辑该文章'
            })
        }

    } else {
        return res.json({
            code: 0,
            msg: '未正确传参!'
        })
    }
})

//修改文章
router.post('/fixContent', async (req, res) => {
    let {id, tags, title, htmlContent, markDown} = req.body

    let updateData = await Content.updateOne({
        _id: id,
    }, {
        $set: {tags, title, htmlContent, markDown}
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
})



//上传word
router.post('/uploadFile', async (req, res) => {
    let form = new forms.IncomingForm(); //创建上传表单
    form.uploadDir = './views/static/file'; //设置上传目录
    form.keepExtensions = true; //保留后缀
    form.maxFieldsSize = 4 * 1024 * 1024; //文件大小

    form.parse(req, async (err, fields, files) => {
        let {title, tags} = fields
        // console.log(files.file.type)
        let fileType = String(files.file.name)
        console.log(fileType)
        //   if (err) {
        //     res.locals.error = err;
        //     res.render('index', {
        //       title: TITLE
        //     });
        //     return;
        //   }
        //显示地址；
        var showUrl = files.file.path;
        // let html = ''
        if (showUrl) {
            if (fileType.match('pdf')) {
                let pdfParser = new PDFParser(this, 1);
                pdfParser.loadPDF(showUrl);
                pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
                pdfParser.on("pdfParser_dataReady",async pdfData => {
                    let html = pdfParser.getRawTextContent()
                    const content = Content({
                        markDown: '',
                        htmlContent: html,
                        title,
                        tags,
                        Department: userMeg.Department,
                        create_user: userMeg._id,
                        file: showUrl
                    })

                    let save = await content.save()

                    if (save._id) {
                        return res.json({
                            code: 1,
                            meg: '上传成功！'
                        })
                    } else {
                        fs.unlink(showUrl, function() {})
                        return res.json({
                            code: 0,
                            meg: '上传失败！'
                        })
                    }
                });
            } else if (fileType.match('docx')||fileType.match('doc')) {
                mammoth.convertToHtml({path: showUrl})
                    .then(async function(result){
                        let html = result.value; // The generated HTML
                        let messages = result.messages; // Any messages, such as warnings during conversion
                        // console.log(html)
                        // res.send(html)
                        const content = Content({
                            markDown: '',
                            htmlContent: html,
                            title,
                            tags,
                            Department: userMeg.Department,
                            create_user: userMeg._id,
                            file: showUrl
                        })

                        let save = await content.save()

                        if (save._id) {
                            return res.json({
                                code: 1,
                                meg: '上传成功！'
                            })
                        } else {
                            fs.unlink(showUrl, function() {})
                            return res.json({
                                code: 0,
                                meg: '上传失败！'
                            })
                        }
                    })
                    .done();
            } else if (fileType.match('xls')||fileType.match('xlsx')) {
                xlsToJson({
                    input: showUrl,  // input xls
                    output: "./views/static/file/output.json" // output json
                    //sheet: "sheet1",  // specific sheetname
                }, async function (err, result) {
                    if (err) {
                        const content = Content({
                            markDown: '',
                            htmlContent: '无法正常解析出html',
                            title,
                            tags,
                            Department: userMeg.Department,
                            create_user: userMeg._id,
                            file: showUrl
                        })

                        let save = await content.save()

                        if (save._id) {
                            return res.json({
                                code: 1,
                                meg: '上传成功！但未成功转换成html，可能无法全局检索到!'
                            })
                        } else {
                            fs.unlink(showUrl, function() {})
                            return res.json({
                                code: 0,
                                meg: '上传失败！'
                            })
                        }
                    } else {
                        const content = Content({
                            markDown: '',
                            htmlContent: JSON.stringify(result),
                            title,
                            tags,
                            Department: userMeg.Department,
                            create_user: userMeg._id,
                            file: showUrl
                        })

                        let save = await content.save()

                        if (save._id) {
                            return res.json({
                                code: 1,
                                meg: '上传成功！'
                            })
                        } else {
                            fs.unlink(showUrl, function() {})
                            return res.json({
                                code: 0,
                                meg: '上传失败！'
                            })
                        }
                    }
                });

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

module.exports = router