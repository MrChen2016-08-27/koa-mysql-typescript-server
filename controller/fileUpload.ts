import _ = require("lodash");
import config from "../config";
import fs = require("fs");
import path = require("path");
import { DefaultState, Context } from 'koa';

function getFileName(filename: string): string {
    let result = "";
    if (filename) {
        // 避免windows 和 linux 下的路径问题
        let strArray = filename.split(path.sep);
        result = strArray[strArray.length - 1];
    }
    return result;
}
/**
 *
 */
export const uploadFile = async (ctx: Context, next: any) => {
    if (ctx.request.files &&  !(ctx.request.files.file instanceof Array)) {

        let filename: string = ctx.request.files.file.path;
        filename = getFileName(filename);
        let path: string = `${config.file.wwww}/${filename}`;
        ctx.rest({
            fileName: path,
        });
    };
}


export const uploadImg = async (ctx: Context, next: any) => {
    if (ctx.request.files &&  !(ctx.request.files.file instanceof Array)) {
        let filename: string = ctx.request.files.file.path;
        // filename = filename.substring(filename.lastIndexOf('\\') + 1)
        filename = getFileName(filename);
        let path: string = `${config.image.wwww}/${filename}`;
        ctx.rest({
            fileName: path,
        });

    }
};
