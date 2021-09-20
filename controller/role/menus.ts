

export interface AppRouterItemInterface {
    id: string | number;
    apiKey: string;
    title: string;
    children?: AppRouterItemInterface[]
}

// 作为 Layout子组件 展示, 并为左侧菜单显示的路由
export const appRouter: AppRouterItemInterface[] = [
    {
        id: '1',
        apiKey: '/api',
        title: '系统管理',
        children: [
            {
                id: '1',
                apiKey: '/role',
                title: '角色管理'
            },
            {
                id: '3',
                apiKey: '/user/admin',
                title: '用户管理'
            }
        ]
    },
]
