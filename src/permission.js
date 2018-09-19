import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { getToken } from '@/utils/auth'
import  store from '@/store'
router.beforeEach((to, from, next) => {
  NProgress.start()
    const  userInfo = store.getters.userInfo
    if(!userInfo.userName){
      if(to.path.indexOf("publish") != -1 ||to.path.indexOf("manager") != -1 || to.path.indexOf("bbs_edit")!= -1){
        next({
          path: '/'
        })
      }else{
        next()
      }
    }else{
      next()
    }


})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
