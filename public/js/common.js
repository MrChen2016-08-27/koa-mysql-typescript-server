

var DateTool = {
    formateDate: function formateDate(val) {
        return val ? moment(val).format("YYYY-MM-DD") : '';

    },
    formateDateTime: function formateDateTime(val) {
        return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : '';
    },
}

$.ajaxSetup({cache:false});

var TableTool = {
    queryParams: function queryParams(params) {
        return {
            search: params.searchText,
            pageNumber: params.pageNumber,
            r: Math.random()
        };
    },
    resetTable: function resetTable(url) {
        $('#myTable').bootstrapTable("refresh", {url : url});
    }
};
var ajaxUtil = {
    // 渲染数据到模板
    renderTemplate: function renderTemplate(template, data) {
        var regRule = /\{\{([\w\s\.^\{\{^\}\}]+)\}\}/g;
        var result = template.replace(regRule, function (value) {
            var val1 = value.match(/[\w\s.]+/);
            var attrs = val1[0].split('.');
            var i = 1;
            var dataValue = data;
            for (i; i < attrs.length; i++) {
                // 消除字段空格
                var field = attrs[1].replace(/\s/g, "");
                if (!dataValue[field]) {
                    dataValue = null;
                    break;
                } else {
                    dataValue = dataValue[field]; 
                }
            }
            return dataValue || '';
        });
        return result;
    },
    // 将 json 对象变为 get请求参数格式
    stringifyParams: function stringifyParams(params, isFirst) {
        var str = '';
        var index = 0;
        for (var i in params) {
            if (isFirst && index == 0) {
                str += "?" + i + "=" + params[i];
                index ++;
            } else {
                str += "&" + i + "=" + params[i];
            }
            console.log(str);
        }
        return str;
    }
};
var fileTool = {
    fileUpload: function fileUpload(url, field, oElement, cb, errCb) {
        var fileData = new FormData();
        fileData.append(field, oElement.files[0]);
        $.ajax({
            url: url,
            type: 'POST',
            data: fileData,
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false,  // 告诉jQuery不要去设置Content-Type请求头
            success: function success(data, textStatus, jqXHR) {
                console.log(data, '###');
                if (data.code == 200) {
                    cb(data);
                } else {

                }
            },
            error: function error(jqXHR, errInfo, e) {
                errCb(jqXHR);
            }
        });
    }
};



function datePicker(beginSelector, endSelector) {
    // 仅选择日期
    $(beginSelector).datepicker(
        {
            language: "zh-CN",
            autoclose: true,
            startView: 0,
            format: "yyyy-mm-dd",
            clearBtn: true,
            todayBtn: false,
            endDate: new Date()
        }).on('changeDate', function (ev) {
        if (ev.date) {
            $(endSelector).datepicker('setStartDate', new Date(ev.date.valueOf()))
        } else {
            $(endSelector).datepicker('setStartDate', null);
        }
    });

    $(endSelector).datepicker(
        {
            language: "zh-CN",
            autoclose: true,
            startView: 0,
            format: "yyyy-mm-dd",
            clearBtn: true,
            todayBtn: false,
            endDate: new Date()
        }).on('changeDate', function (ev) {
        if (ev.date) {
            $(beginSelector).datepicker('setEndDate', new Date(ev.date.valueOf()))
        } else {
            $(beginSelector).datepicker('setEndDate', new Date());
        }
    })
}



// 表单深层结构 name命名格式 xxx-xxx-xxx-...
function parseFormParams(id) {
    const params = {};
    $(id).find('[name]').each(function () {
        const attrs = $(this).attr('name').split('-');
        // 深层嵌套参数解析
        const _this = this;
        const paraseAttrs = function (params, index){
            if (index < attrs.length - 1) {
                if (!params[attrs[index]]) {
                    params[attrs[index]] = {};
                }
                paraseAttrs(params[attrs[index]], ++index);
            } else {
                params[attrs[index]] = $(_this).val();
                return;
            }
        }
        // 递归解析
        paraseAttrs(params, 0);
    });
    return params;
}

// 表单深层结构模板映射 name命名格式 xxx-xxx-xxx-...
function mappingFormTemplate(id, data) {
    const params = data;
    $(id).find('[name]').each(function () {
        const attrs = $(this).attr('name').split('-');
        // 深层嵌套参数解析
        const _this = this;
        const mappingTemplate = function (params, index){
            if (index < attrs.length - 1) {
                if (!params[attrs[index]]) {
                    params[attrs[index]] = {};
                }
                mappingTemplate(params[attrs[index]], ++index);
            } else {
                // params[attrs[index]] = $(_this).val();
                $(_this).val(params[attrs[index]]);
                return;
            }
        }
        // 递归解析
        mappingTemplate(params, 0);
    });
    return params;
}

function openUrl(url, link) {
    if (!link) {
        window.open(url);
    } else {
        window.location.href = url;
    }
}

// 超出字符串个数出现省略号, 用于多行文本
function textOverflow(str, maxLength) {
    if (str.length <= maxLength) {
        return str;
    }
    console.log(str.length);
    var text = str.substring(0, maxLength);
    return text + '...';
}

// 时间转换
$(function() {
    $(".time-format").each(function() {
        var time = DateTool.formateDate($(this).text());
        $(this).text(time);
    });

});
