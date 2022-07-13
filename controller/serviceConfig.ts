import { Context } from 'koa';
import { typeConfig } from './serviceConfig/typeConfig';

export const getTypeConfig = (ctx: Context, next: () => Promise<void>) => {
    ctx.rest({
        typeConfig
    });
}