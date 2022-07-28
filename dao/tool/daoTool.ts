import { Op, WhereOptions } from "sequelize";
import { ListParamsInterface } from "../../global.interface";
import moment = require("moment");

interface ListAndDateParamsInterface {
    beginDate?: string | number | Date;
    endDate?: string | number | Date;
}
// Expand
// ListAndDateParamsInterface extends ListParamsInterface;

/**
 *
 * @param params 包含时间的请求参数
 * @returns
 */
export function addDateRangeFilter<T>(
    params: ListParamsInterface
): WhereOptions<T> {
    let whereOption: WhereOptions<any> = {};
    if (params.beginDate && params.endDate) {
        let beginDate = moment(Number(params.beginDate)).toDate();
        let endDate = moment(Number(params.endDate)).toDate();
        // 如果开始时间和结束时间都要筛选，范围
        whereOption.createdAt = {
            [Op.between]: [beginDate, endDate],
        };
    } else if (params.beginDate) {
        let beginDate = moment(Number(params.beginDate)).toDate();
        // 只筛选开始时间
        whereOption.createdAt = {
            [Op.gte]: [beginDate],
        };
    } else if (params.endDate) {
        let endDate = moment(Number(params.endDate)).toDate();
        // 只筛选结束时间
        whereOption.createdAt = {
            [Op.lte]: [endDate],
        };
    }

    return whereOption as WhereOptions<T>;
}

/**
 *
 * @param fields 需要被keyword值模糊匹配的字段
 * @param keyword 关键字值
 */
export function addKeywordFilter<T>(fields: string[], keyword: string) {}
