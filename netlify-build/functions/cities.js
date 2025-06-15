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
        // 返回预定义的城市列表
        const cities = [
            '深圳', '北京', '上海', '广州', '杭州', '南京', '武汉', '成都',
            '西安', '重庆', '天津', '青岛', '大连', '厦门', '苏州', '无锡',
            '宁波', '佛山', '东莞', '长沙', '郑州', '沈阳', '哈尔滨', '长春',
            '石家庄', '太原', '呼和浩特', '兰州', '西宁', '银川', '乌鲁木齐',
            '拉萨', '昆明', '贵阳', '南宁', '海口', '三亚', '福州', '济南',
            '合肥', '南昌', '珠海', '中山', '惠州', '江门', '湛江', '茂名',
            '肇庆', '梅州', '汕头', '揭阳', '潮州', '韶关', '清远', '阳江',
            '云浮', '河源', '汕尾'
        ];

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                status: 'ok',
                cities: cities
            })
        };

    } catch (error) {
        console.error('获取城市列表错误:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                status: 'error',
                message: '获取城市列表失败',
                cities: ['深圳', '北京', '上海', '广州', '杭州'] // 默认城市列表
            })
        };
    }
}; 