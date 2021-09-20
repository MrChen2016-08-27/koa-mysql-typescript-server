import Router = require('koa-router');
import ratelimit = require('koa-ratelimit');
import Redis from '../tool/redis';
import api from './api';
import page from './page';
import { appRouter } from '../controller/role/menus';
import userDao = require('../dao/user');
import { AuthorityInterface } from '../global.interface';
import { DefaultState, Context } from 'koa';



const router = new Router<DefaultState, Context>();


// 对post请求的频率监控
router.post(
    '/*',
    ratelimit({
        db: Redis,
        duration: 60000,
        errorMessage: '短时间内访问的频率过高',
        id: ctx => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total'
        },
        max: 30,
        disableHeader: false,
        driver: "redis"
    })
)

// 对页面渲染请求的频率监控
router.get(
    '/*',
    ratelimit({
        db: Redis,
        duration: 60000,
        errorMessage: '短时间内访问的频率过高',
        id: ctx => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total'
        },
        whitelist: (ctx) => {
            if (ctx.path.substring(0, 4) == '/api') {
                return true
            } else {
                return false
            }
        },
        max: 600,
        disableHeader: false,
        driver: "redis"
    })
)

// 对每个接口的不同角色的权限访问控制
router.all('*', async (ctx: any, next) => {
    const path = ctx.path
    let authority: AuthorityInterface = {};
    if (ctx.state.user) {
        let userId = ctx.state.user.data.id
        authority = await userDao.getUserAuth(userId)
    }

    let authPaths: any = {}
    if (authority.all) {
        return next()
    }
    appRouter.forEach(item => {
        let parentPath = item.apiKey
        if (item.children && item.children.length > 0) {
            item.children.forEach(child => {
                let apiPath = parentPath + child.apiKey
                if (authority[item.id] && authority[item.id][child.id]) {
                    authPaths[apiPath] = authority[item.id][child.id]
                }
            })
        }
    })
    const types: Array<string> = ['add', 'delete', 'update', 'get|list']
    const basePath: string = path.substring(0, path.lastIndexOf('/'))
    const endTag: string = path.substring(path.lastIndexOf('/') + 1)
    let isTag: boolean = false
    let valid: boolean = false
    if (authPaths[basePath] || authPaths[basePath] === 0) {
        types.forEach((str, index) => {
            let marks: string[] = str.split('|')
            let result = marks.find(tag => tag == endTag)
            if (result) {
                isTag = true
                let a = 1 << index
                if (authPaths[basePath] & a) {
                    valid = true
                    return valid
                }
            }
        })
    }
    if (!isTag) {
        return next()
    }
    if (!valid && !authPaths[basePath] && authPaths[basePath] !== 0) {
        return next()
    } else if (valid) {
        return next()
    } else {
        ctx.status = 401;
        throw new ctx.ApiError('auth_shortage')
    }
})


router.use(api.routes(), api.allowedMethods())
router.use(page.routes(), page.allowedMethods())

export default router
