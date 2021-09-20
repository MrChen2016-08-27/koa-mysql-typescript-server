const _lang = require('lodash/lang')
import config from '../config'
import Role from '../model/role';
import { AppRouterItemInterface } from '../controller/role/menus';
import { AuthorityInterface } from '../global.interface';

/**
 * 获得计算拥有的角色集合的合并的最大权限
 * */
export const getRolesMaxAuth = (roleList: Role[]): AuthorityInterface => {
    let result: AuthorityInterface = {}
    let list: any[] = roleList.map(item => {
        if (typeof item.authority == 'string') {
            return JSON.parse(item.authority)
        }
        return item.authority;
    })
    list.map(obj => {
        for (let key in obj) {
            if (typeof obj[key] !== 'object') {
                result[key] = obj[key]
                continue
            }
            if (!result[key]) {
                result[key] = _lang.cloneDeep(obj[key])
                continue
            }
            for (let key2 in obj[key]) {
                if (!result[key][key2]) {
                    result[key][key2] = _lang.cloneDeep(obj[key][key2])
                    continue
                }
                let num = 0
                // 对每一项增删改查的权限进行合并
                for (let i = 0; i < config.apiKeys.length; i++) {
                    let e = 1 << i
                    let a = obj[key][key2] & e
                    let b = result[key][key2] & e
                    if (a || b) {
                        num += Math.pow(2, i)
                    }
                }
                result[key][key2] = num
            }
        }
    })
    return result
}

/**
 * 过滤权限菜单
 */
export const filterAuthMenus = (authObj: any, list: AppRouterItemInterface[]): AppRouterItemInterface[] => {
    let results: AppRouterItemInterface[] = [];
    for (let i in authObj) {
        let nowAppRouter: AppRouterItemInterface | undefined = list.find(item => item.id == i)
        if (nowAppRouter) {
            let nowObj: AppRouterItemInterface = _lang.cloneDeep(nowAppRouter)
            if (typeof authObj[i] == 'object' && authObj[i] != null) {
                nowObj.children = filterAuthMenus(authObj[i], nowObj.children || [])
                if (nowObj.children.length > 0) {
                    results.push(nowObj)
                }
            } else if (authObj[i] > 0) {
                results.push(nowObj)
            }
        }
    }
    return results
}