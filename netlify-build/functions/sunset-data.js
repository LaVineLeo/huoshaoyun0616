// 时间处理工具函数
const timeUtils = {
    getToday() {
        return new Date();
    },

    getTomorrow() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    },

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    formatDateCode(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    },

    formatTimeCode(timeType, date) {
        const prevDay = new Date(date);
        prevDay.setDate(prevDay.getDate() - 2);
        
        const year = prevDay.getFullYear();
        const month = String(prevDay.getMonth() + 1).padStart(2, '0');
        const day = String(prevDay.getDate()).padStart(2, '0');
        const hour = timeType === 'rise' ? '12' : '06';
        return `${year}${month}${day}${hour}z`;
    },

    generateImageURL(timeType, date) {
        const dateCode = this.formatDateCode(date);
        const timeCode = this.formatTimeCode(timeType, date);
        return `https://sunsetbot.top/static/media/map/%E4%B8%AD%E4%B8%9C_${dateCode}_${timeType}_${timeCode}.jpg`;
    },

    generateSummary(date, timeType) {
        const dateStr = this.formatDate(date);
        const utcPrevDay = this.getUTCPreviousDay(date);
        const eventName = timeType === 'rise' ? '日出' : '日落';
        const timeDesc = timeType === 'rise' ? '凌晨时次' : '傍晚时次';
        const hour = timeType === 'rise' ? '12' : '06';
        
        return `(GFS) [中东] ${dateStr} ${eventName} ${timeDesc} (UTC+0 ${utcPrevDay} ${hour})`;
    },

    getUTCPreviousDay(date) {
        const prevDay = new Date(date);
        prevDay.setDate(prevDay.getDate() - 2);
        return this.formatDate(prevDay);
    },

    getDateInfo(dateParam) {
        const targetDate = dateParam === 'today' ? this.getToday() : this.getTomorrow();
        return {
            date: targetDate,
            formatted: this.formatDate(targetDate),
            code: this.formatDateCode(targetDate),
            isToday: dateParam === 'today'
        };
    }
};

exports.handler = async (event, context) => {
    // 设置CORS头
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // 处理OPTIONS请求（预检请求）
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight' })
        };
    }

    try {
        // 获取查询参数
        const params = event.queryStringParameters || {};
        const city = params.city || '深圳';
        const date = params.date || 'today';
        const timeType = params.timeType || 'set';
        
        // 使用时间工具获取日期信息
        const dateInfo = timeUtils.getDateInfo(date);
        const dateStr = dateInfo.formatted;
        
        // 初始化数据对象
        let data;
        
        if (city === '深圳') {
            if (date === 'today') {
                if (timeType === 'rise') {
                    data = {
                        img_href: timeUtils.generateImageURL(timeType, dateInfo.date),
                        img_summary: timeUtils.generateSummary(dateInfo.date, timeType),
                        place_holder: "深圳",
                        query_id: "869494",
                        status: "ok",
                        tb_aod: "0.324<br>（一般）",
                        tb_event_time: `${dateStr}<br>05:40:28`,
                        tb_quality: "0.075<br>（小烧）",
                        time_type: "rise",
                        remark: "今日日出",
                        url: "https://sunsetbot.top/?query_id=869494&intend=select_city&query_city=%E6%B7%B1%E5%9C%B3&event_date=None&event=rise_1&times=None"
                    };
                } else {
                    data = {
                        img_href: timeUtils.generateImageURL(timeType, dateInfo.date),
                        img_summary: timeUtils.generateSummary(dateInfo.date, timeType),
                        place_holder: "深圳",
                        query_id: "869495",
                        status: "ok",
                        tb_aod: "0.298<br>（还不错）",
                        tb_event_time: `${dateStr}<br>18:45:12`,
                        tb_quality: "0.142<br>（小烧）",
                        time_type: "set",
                        remark: "今日日落",
                        url: "https://sunsetbot.top/?query_id=869495&intend=select_city&query_city=%E6%B7%B1%E5%9C%B3&event_date=None&event=set_1&times=None"
                    };
                }
            } else {
                if (timeType === 'rise') {
                    data = {
                        img_href: timeUtils.generateImageURL(timeType, dateInfo.date),
                        img_summary: timeUtils.generateSummary(dateInfo.date, timeType),
                        place_holder: "深圳",
                        query_id: "869496",
                        status: "ok",
                        tb_aod: "0.310<br>（还不错）",
                        tb_event_time: `${dateStr}<br>05:41:15`,
                        tb_quality: "0.089<br>（小烧）",
                        time_type: "rise",
                        remark: "明日日出"
                    };
                } else {
                    data = {
                        img_href: timeUtils.generateImageURL(timeType, dateInfo.date),
                        img_summary: timeUtils.generateSummary(dateInfo.date, timeType),
                        place_holder: "深圳",
                        query_id: "869497",
                        status: "ok",
                        tb_aod: "0.285<br>（还不错）",
                        tb_event_time: `${dateStr}<br>18:44:52`,
                        tb_quality: "0.156<br>（小烧）",
                        time_type: "set",
                        remark: "明日日落"
                    };
                }
            }
        } else {
            // 其他城市的通用数据
            data = {
                img_href: timeUtils.generateImageURL(timeType, dateInfo.date),
                img_summary: timeUtils.generateSummary(dateInfo.date, timeType),
                place_holder: city,
                query_id: "default",
                status: "ok",
                tb_aod: "0.300<br>（还不错）",
                tb_event_time: `${dateStr}<br>${timeType === 'rise' ? '06:00:00' : '18:30:00'}`,
                tb_quality: "0.120<br>（小烧）",
                time_type: timeType,
                remark: `${city}${date === 'today' ? '今日' : '明日'}${timeType === 'rise' ? '日出' : '日落'}`
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('API错误:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                status: 'error',
                message: '服务器内部错误'
            })
        };
    }
}; 