import xlsx = require("node-xlsx");
import path = require("path");
import fs = require("fs");
import config from "../config";

export interface XlsxHeaderConfigItemInterface {
    colTitle: string;
    fieldName: string;
    formatter?: (row: any, index: number) => string | number;
}

function generateExcel(resultList: any[], fileName: string) {
    let buffer = xlsx.build([{ name: "mySheetName", data: resultList }]);
    // let dvData = new DataView(buffer);
    let exportPath = path.join(
        __dirname,
        "../../",
        config.file.local,
        fileName
    );
    fs.writeFileSync(exportPath, buffer as unknown as DataView, "utf-8");
    return exportPath;
}

export const exportXlsxFile = (
    xlsxHeaderConfig: XlsxHeaderConfigItemInterface[],
    dataList: any[],
    fileName: string,
    filter?: (row: any, index: number) => boolean
) => {
    let xlsxData = [];
    // 生成xlsx表头
    let xlsxHeader = xlsxHeaderConfig.map(
        (item: XlsxHeaderConfigItemInterface) => item.colTitle
    );
    for (let i = 0; i < dataList.length; i++) {
        let data = dataList[i];
        let xlsxRow = <string[]>[];

        // 获取表格数据
        xlsxHeaderConfig.forEach((item) => {
            let text = data[item.fieldName];
            if (item.formatter) {
                text = item.formatter(data, i);
            }
            if (text) {
                xlsxRow.push(text);
            } else {
                xlsxRow.push("");
            }
        });
        xlsxData.push(xlsxRow);
    }
    xlsxData.unshift(xlsxHeader);

    let localFilePath: string = generateExcel(xlsxData, fileName);
    let wwwFilePath = path.join(config.file.wwww, fileName);
    return {
        localFilePath,
        wwwFilePath,
    };
};
