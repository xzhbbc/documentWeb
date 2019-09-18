# 文档系统

### 技术栈用的是express vue mongoose

## 实现功能：

- [x] 权限管理
- [x] 支持markdown编辑器
- [x] 支持富文本编辑器
- [x] 支持word,excel,pdf的录入
- [ ] 支持word,excel,pdf的文件预览
- [x] 支持全文检索
- [x] 支持markdown 三级四级标题的目录索引
- [ ] 支持富文本目录索引


### 开启客服端

```
cd views
```

```
npm install or yarn install
```

```
npm run dev
```

#### 也可以不开客户端，直接执行

```
npm run build
```

##### 就能直接访问localhost:3002

### 开启数据库
```language
cd db
```

```
mongod --dbpath=./ --port=27018
```

### 开启服务器
```
npm install or yarn install
```

###### 在根目录
```
nodemon app.js or node app
```

##### 这里会自动创建一个部门和一个管理员账号 admin a123

##### 这个项目是之前公司要求要做的，时间关系弄了差不多3天，还有一些需求没有实现，后续会加上去。如果有bug请及时跟我提出,感谢关注和star。




