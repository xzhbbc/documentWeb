import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Index from "../page/Index/Index";
import MegContent from "../page/MegContent/MegContent";
import Login from "../page/ServerPage/Login/Login";
import Server from "../page/ServerPage/Server/Server";
import SeverIndex from '../page/ServerPage/Server/Index'
import MarkdownSend from '../page/ServerPage/markdownSend/markdownSend'
import QuillSend from "../page/ServerPage/QuillSend/QuillSend";
import DepartmentInput from "../page/ServerPage/DepartmentInput/DepartmentInput";
import WordSee from "../page/WordSee/WordSee";
import Member from "../page/ServerPage/Member/Member";
import ContentSee from "../page/ServerPage/ContentSee/ContentSee";
import DepartmentEditor from "../page/ServerPage/DepartmentEditor/DepartmentEditor";
import WordSend from "../page/ServerPage/WordSend/WordSend";
import FixCode from '../page/ServerPage/FixCode/fixCode'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/megContent',
      name: 'MegContent',
      component: MegContent
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/wordSee',
      name: 'WordSee',
      component: WordSee
    },
    {
      path: '/server',
      name: 'Server',
      component: Server,
      children: [
        {
          path: '/',
          name: 'SeverIndex',
          component: SeverIndex
        },
        {
          path: '/markdownSend',
          name: 'MarkdownSend',
          component: MarkdownSend
        },
        {
          path: '/quillSend',
          name: 'QuillSend',
          component: QuillSend
        },
        {
          path: '/departmentInput',
          name: 'DepartmentInput',
          component: DepartmentInput
        },
        {
          path: '/member',
          name: 'Member',
          component: Member
        },
        {
          path: '/contentSee',
          name: 'ContentSee',
          component: ContentSee
        },
        {
          path: '/departmentEditor',
          name: 'DepartmentEditor',
          component: DepartmentEditor
        },
        {
          path: '/wordSend',
          name: 'WordSend',
          component: WordSend
        },
        {
          path: '/fixCode',
          name: 'FixCode',
          component: FixCode
        }
      ]
    }
  ]
})
