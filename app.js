const express = require('express')

const bodyParser = require('body-parser')

const cookieParser = require('cookie-parser')

const app = express();

app.use(cookieParser())
app.use(bodyParser.json())

const path = require('path')
app.use(express.static(path.resolve(__dirname, './views/dist')))
// app.use(express.static(path.join(__dirname, './views/build')))

let {
    connect,
    initSchemas,
    initAdmin,
    initDepartment
} = require('./modelSchemas/init')

;
(async () => {
    await connect()
    initSchemas()
    //创建部门
    await initDepartment()
    //创建管理员
    await initAdmin()

    //注册路由
    const userRouter = require('./router/user')
    const departRouter = require('./router/department')
    const frontRouter = require('./router/front')
    const contentRouter = require('./router/content')

    app.use('/user', userRouter)
    app.use('/department', departRouter)
    app.use('/front', frontRouter)
    app.use('/content', contentRouter)

    app.listen(3002, () => {
        console.log('服务器开启，3002')
    });
})()

