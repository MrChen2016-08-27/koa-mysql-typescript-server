import { Op, WhereOptions, Model } from "sequelize";
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
    queryBySnMethod: (sn: string) => Promise<T>,
    prefixStr?: string
): Promise<string> {
    const chance = new Chance();
    let randomStr = chance.string({
        length: 5,
        alpha: true,
        casing: "upper",
        numeric: true,
    });
    if (!prefixStr) {
        prefixStr = "TEST";
    }
    let sn = `${prefixStr}${moment().valueOf()}${randomStr}`;
    let result = await queryBySnMethod(sn);
    if (result) {
        // 如果指定时间戳内发生重复存在，重新随机一次
        return await gennerateSn(queryBySnMethod);
    } else {
        return sn;
    }
}

/**
 * @description 合并列表包含指定id的表数据
 * @param listData 列表数据
 * @param listModelFieldKey 列表中额外id所指定的表
 * @param queryModelMoreMethod 通过id列表请求该额外表的方法
 */
export async function connectListAndChildData<T, TChild>(
    listData: T[],
    listModelFieldKey: string,
    queryModelMoreMethod: (idList: number[]) => Promise<TChild[]>
) {
    let childId = `${listModelFieldKey}Id`;
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
        let childList: TChild[] = await queryModelMoreMethod(childIdList);
        resultList = listData.map((data: any) => {
            let itemData: any = data.toJSON();
            if (itemData[childId]) {
                let childResult = childList.find(
                    (childItem: any) => childItem.id == itemData[childId]
                );
                itemData[listModelFieldKey] = childResult;
            }
            return itemData;
        });
    }
    return resultList;
}

interface ExtraTargetField {
    listNewFieldName: string;
    sourceFieldName: string;
}
/**
 * @description 合并列表包含指定id的表数据的某个字段
 * @param listData 列表数据
 * @param listModelKey 列表中额外id所指定的表名称
 * @param listAddFieldConfig 要将目标表字段链接至列表行字段的配置
 * @param queryModelMoreMethod 通过id列表请求该额外表的方法
 */
export async function connectListAndOtherDataField<T, TChild>(
    listData: T[],
    listModelKey: string,
    listAddFieldConfig: ExtraTargetField[],
    queryModelMoreMethod: (idList: number[]) => Promise<TChild[]>
) {
    let childId = `${listModelKey}Id`;
    let otherModelIdList: number[] = [];
    listData.forEach((data: any) => {
        if (data[childId]) {
            let exist = otherModelIdList.find(
                (idStr) => idStr == data[childId]
            );
            if (!exist) {
                otherModelIdList.push(data[childId]);
            }
        }
    });
    let resultList: any[] = [];
    if (otherModelIdList.length > 0) {
        let childList: TChild[] = await queryModelMoreMethod(otherModelIdList);
        resultList = listData.map((data: any) => {
            let itemData: any = data.toJSON();
            if (itemData[childId]) {
                let childResult: any = childList.find(
                    (childItem: any) => childItem.id == itemData[childId]
                );
                listAddFieldConfig.forEach((confitItem) => {
                    itemData[confitItem.listNewFieldName] =
                        childResult[confitItem.sourceFieldName];
                });
            }
            return itemData;
        });
    }
    return resultList;
}

/**
 * @description 如果params中存在 nameList 的参数值，则添加条件匹配筛选
 * @param params 参数
 * @param nameList 指定条件字段
 * @returns
 */
export function addFilterName<T>(
    params: any,
    nameList: string[]
): WhereOptions<T> {
    let whereOption: any = {};
    nameList.forEach((name: string) => {
        if (
            params[name] !== null &&
            params[name] !== undefined &&
            params[name] !== ""
        ) {
            whereOption[name] = params[name];
        }
    });
    return whereOption as WhereOptions<T>;
}

/**
 * @description 进行模糊过滤
 * @param params 要进行模糊过滤原始数据
 * @param nameList 对应模糊过滤的字段
 * @returns
 */
export function addLikeFilterName<T>(
    params: any,
    nameList: string[]
): WhereOptions<T> {
    let whereOption: any = {};
    nameList.forEach((name: string) => {
        if (
            params[name] !== null &&
            params[name] !== undefined &&
            params[name] !== ""
        ) {
            whereOption[name] = {
                [Op.like]: `%${params[name]}%`,
            };
        }
    });
    return whereOption as WhereOptions<T>;
}

export function addOrFilterName<T>(
    params: any,
    nameList: string[]
): WhereOptions<T> {
    let whereOption: any = {};
    let orFieldList: any = [];
    nameList.forEach((name: string) => {
        if (
            params[name] !== null &&
            params[name] !== undefined &&
            params[name] !== ""
        ) {
            orFieldList.push({
                [name]: params[name],
            });
        }
    });
    if (orFieldList.length > 0) {
        whereOption = {
            [Op.or]: orFieldList,
        };
    }
    return whereOption as WhereOptions<T>;
}
