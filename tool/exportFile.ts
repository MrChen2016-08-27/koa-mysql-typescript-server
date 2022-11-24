import xlsx = require("node-xlsx");
import path = require("path");
import fs = require("fs");
import config from "../config";
import JSZip = require("jszip");
import puppeteer = require("puppeteer");

export interface XlsxHeaderConfigItemInterface {
    colTitle: string;
    fieldName: string;
    formatter?: (row: any, index: number) => string | number;
}

function generateExcel(resultList: any[], fileName: string) {
    let buffer = xlsx.build([{ name: "mySheetName", data: resultList }]);
    // let dvData = new DataView(buffer);
    let exportPath = path.join(__tsDirName, "../", config.file.local, fileName);
    fs.writeFileSync(exportPath, buffer as unknown as DataView, "utf-8");
    return {
        exportPath,
        excelBuffer: buffer,
    };
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

    let { exportPath: localFilePath } = generateExcel(xlsxData, fileName);
    let wwwFilePath = path.join(config.file.wwww, fileName);
    return {
        localFilePath,
        wwwFilePath,
    };
};

export interface ZipFileItem {
    name: string;
    data: any;
    zipOption?: JSZip.JSZipFileOptions;
}

// 生成zip文件
export const exportZipFile = async (
    filesConfig: ZipFileItem[],
    zipName: string
) => {
    let zip = new JSZip();
    filesConfig.forEach((item) => {
        if (item.zipOption) {
            zip.file(item.name, item.data, item.zipOption);
        } else {
            zip.file(item.name, item.data);
        }
    });
    let content = await zip.generateAsync({ type: "nodebuffer" });
    let exportPath = path.join(__tsDirName, "../", config.file.local, zipName);
    let localFilePath = exportPath;
    fs.writeFileSync(exportPath, content as unknown as DataView, "utf-8");
    let wwwFilePath = path.join(config.file.wwww, zipName);
    return {
        localFilePath,
        wwwFilePath,
    };
};

function imageTypeHandle(base64Data: string, type: string) {
    if (type == "png") {
        return `data:image/png;base64,${base64Data}`;
    }
    if (type == "jpg") {
        return `data:image/jpg;base64,${base64Data}`;
    }
}

// 导出图片通过网址
export const exportImageByUrl = async (
    url: string,
    imgName: string,
    imgType = "png",
    elementSelector?: string
) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    let base64: Buffer | string | null | undefined = null;
    if (elementSelector) {
        const allResultsSelector = elementSelector;
        let selectorElement = await page.waitForSelector(allResultsSelector!);
        base64 = await selectorElement?.screenshot({ encoding: "base64" });
    } else {
        base64 = await page.screenshot({ encoding: "base64" });
    }

    let base64Result2 = imageTypeHandle(base64 as string, imgType);

    let localFilePath = path.join(
        __tsDirName,
        "../",
        config.image.local,
        imgName
    );
    let imgFileBufferDecoded = Buffer.from(base64 as string, "base64");
    fs.writeFileSync(localFilePath, imgFileBufferDecoded);
    let wwwFilePath = path.join(config.image.wwww, imgName);
    await browser.close();
    return {
        localFilePath,
        wwwFilePath,
        base64,
        formatBase64Result: base64Result2,
    };
};
