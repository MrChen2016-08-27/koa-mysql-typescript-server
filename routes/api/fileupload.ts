import Router = require('koa-router');
import { uploadFile, uploadImg } from '../../controller/fileUpload';
import config from '../../config';
import koaBody = require('koa-body')
import path = require('path')
import { DefaultState, Context } from 'koa';
// const {
//     getMulterUploadExcel,
//     getMulterUploadImg
// } = require('../../tool/upload')

const router = new Router<DefaultState, Context>();

router.prefix('/upload')

router.post(
    '/file',
    koaBody({
        multipart: true,
        formidable: {
            uploadDir: config.file.local,
            // 保持文件后缀
            keepExtensions: true,
            // 文件上传大小, 最大100M
            maxFieldsSize: 100 * 1024 * 1024,
            // 计算文件hash
            hash: 'md5'
        }
    }),
    uploadFile
)
router.post(
    '/img',
    koaBody({
        multipart: true,
        formidable: {
            uploadDir: config.image.local,
            // 保持文件后缀
            keepExtensions: true,
            // 文件上传大小
            maxFieldsSize: 5 * 1024 * 1024,
            // 计算文件hash
            hash: 'md5'
        }
    }),
    uploadImg
)

module.exports = router
