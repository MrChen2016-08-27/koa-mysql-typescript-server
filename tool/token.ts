// import config = require('../config');
// const store = require('./redis');
// const redis = require('redis');
// import tokenApi = require('../api/token');

// let timer: NodeJS.Timer;

// // 获取第三方token, 如果获取异常会循环获取
// export const getToken = async (savekey: string): Promise<void> => {
//     try{
//         const res = await tokenApi.getToken();
//         const data = res.data;
//         const admin = {
//             token: data.Token,
//             uid: data.Uid,
//             userName: data.UserName
//         }
//         // 保存至redis
//         store.set(savekey, JSON.stringify(admin), redis.print);
//         return;
//     } catch (err) {
//         console.log(err);
//         getToken(savekey);
//     }
// };

// export const startExtraToken = (saveKey: string, time: number): void => {
//     clearInterval(timer);
//     timer = setInterval(() => {
//         getToken(saveKey);
//     }, time);
// };

// getToken('extra_token_save_key');

// startExtraToken('extra_token_save_key', 1000 * 60 * 58);

