
interface errCodeInterface {
    [key: string]: string
};

const errCode: errCodeInterface = {
    register_fail: '注册失败, 请稍候重试',
    info_format_error: '信息格式有误',
    mobile_not_null: '手机号不能为空',
    username_not_null: '用户名不能为空',
    mobile_format_error: '手机号格式有误',
    username_format_error: '用户名格式有误',
    password_format_error: '密码长度必须在6-18位之间',
    user_repeat: '用户已存在',
    user_not_exist: '用户不存在',
    login_info_error: '用户名或密码错误',
    super_admin_not_delete: '超级管理员角色禁止被删除',
    super_admin_not_update: '超级管理员角色禁止被修改',
    role_name_repeat: '该角色名称已经存在',
    auth_shortage: '访问权限不足',
    module_name_repeat: '该模块名称已经存在',
    column_name_repeat: '该栏目名称已经存在',
    content_review_disable: '内容审核中',
    product_review_disable: '产品审核中',
    test_Error: '测试异常',
    out_sort_max: '超出指定范围',
    captcha_error: '验证码错误',
    user_order_exist: '有尚未完成的订单需要处理',
    not_order_pay_exist: '用户没有待支付的订单',
    find_no_exist: '该条数据不存在货已被删除'
}

export default errCode;
