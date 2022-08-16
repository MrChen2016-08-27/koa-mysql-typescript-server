import { Op, WhereOptions } from "sequelize";
import { ListParamsInterface } from "../../global.interface";
import moment = require("moment");
import Chance = require("chance");

interface ListAndDateParamsInterface {
    beginDate?: string | number | Date;
    endDate?: string | number | Date;
}
// Expand
// ListAndDateParamsInterface extends ListParamsInterface;

/**
 *
 * @param params 包含时间的请求参数
 * @param modelDateField 模型表中需要筛选的时间类型字段， 默认为 createdAt
 * @param paramBeginDateKey 参数中筛选时间范围的开始时间字段，默认为 beginDate
 * @param paramEndDateKey 参数中筛选时间范围的结束时间字段，默认为 endDate
 * @returns
 */
export function addDateRangeFilter<T>(
    params: ListParamsInterface,
    modelDateField: string = "createdAt",
    paramBeginDateKey: string = "beginDate",
    paramEndDateKey: string = "endDate"
): WhereOptions<T> {
    let whereOption: WhereOptions<any> = {};
    if (params[paramBeginDateKey] && params[paramEndDateKey]) {
        let beginDate = moment(Number(params[paramBeginDateKey])).toDate();
        let endDate = moment(Number(params[paramEndDateKey])).toDate();
        // 如果开始时间和结束时间都要筛选，范围
        whereOption[modelDateField] = {
            [Op.between]: [beginDate, endDate],
        };
    } else if (params[paramBeginDateKey]) {
        let beginDate = moment(Number(params[paramBeginDateKey])).toDate();
        // 只筛选开始时间
        whereOption[modelDateField] = {
            [Op.gte]: beginDate,
        };
    } else if (params[paramEndDateKey]) {
        let endDate = moment(Number(params[paramEndDateKey])).toDate();
        // 只筛选结束时间
        whereOption[modelDateField] = {
            [Op.lte]: endDate,
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

/**
 *
 * @param queryBySnMethod 通过编号查询Model的方法
 * @returns
 */
export async function gennerateSn<T>(
    queryBySnMethod: (sn: string) => Promise<T>
): Promise<string> {
    const chance = new Chance();
    let randomStr = chance.string({
        length: 5,
        alpha: true,
        casing: "upper",
        numeric: true,
    });
    let sn = `ZSA${moment().valueOf()}${randomStr}`;
    let checkProductData = await queryBySnMethod(sn);
    if (checkProductData) {
        // 如果指定时间戳内发生重复存在，重新随机一次
        return await gennerateSn(queryBySnMethod);
    } else {
        return sn;
    }
}

/**
 * @description 合并列表包含指定id的表数据
 * @param listData 列表数据
 * @param listChildFieldKey 列表中额外id所指定的表
 * @param queryChildMoreMethod 通过id列表请求该额外表的方法
 */
export async function connectListAndChildData<T, TChild>(
    listData: T[],
    listChildFieldKey: string,
    queryChildMoreMethod: (idList: number[]) => Promise<TChild[]>
) {
    let childId = `${listChildFieldKey}Id`;
    let childIdList: number[] = [];
    listData.forEach((data: any) => {
        if (data[childId]) {
            let exist = childIdList.find((idStr) => idStr == data[childId]);
            if (!exist) {
                childIdList.push(data[childId]);
            }
        }
    });
    let resultList: any[] = [];
    if (childIdList.length > 0) {
        let childList: TChild[] = await queryChildMoreMethod(childIdList);
        resultList = listData.map((data: any) => {
            let itemData: any = data.toJSON();
            if (itemData[childId]) {
                let childResult = childList.find(
                    (childItem: any) => childItem.id == itemData[childId]
                );
                itemData[listChildFieldKey] = childResult;
            }
            return itemData;
        });
    }
    return resultList;
}

/**
 * @description 如果params中存在 nameList 的参数值，则添加条件筛选
 * @param params 参数
 * @param nameList 指定条件字段
 * @returns
 */
export function addFiterName<T>(
    params: any,
    nameList: string[]
): WhereOptions<T> {
    let whereOption: any = {};
    nameList.forEach((name: string) => {
        if (params[name] !== null && params[name] !== undefined && params[name] !== '') {
            whereOption[name] = params[name];
        }
    });
    return whereOption as WhereOptions<T>;
}
