exports.handler = async (event, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // 获取中国时间（UTC+8）
  const getChinaTime = () => {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const chinaTime = new Date(utc + (8 * 3600000));
    return chinaTime;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };

  try {
    const serverTime = new Date();
    const chinaTime = getChinaTime();
    const tomorrow = new Date(chinaTime);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = {
      message: "时间调试信息",
      server_time: {
        iso: serverTime.toISOString(),
        formatted: formatDateTime(serverTime),
        timezone_offset: serverTime.getTimezoneOffset()
      },
      china_time: {
        iso: chinaTime.toISOString(),
        formatted: formatDateTime(chinaTime),
        date_only: formatDate(chinaTime),
        is_june_16: formatDate(chinaTime) === '2025-06-16'
      },
      tomorrow_china: {
        iso: tomorrow.toISOString(),
        formatted: formatDateTime(tomorrow),
        date_only: formatDate(tomorrow),
        is_june_17: formatDate(tomorrow) === '2025-06-17'
      },
      validation: {
        expected_today: "2025-06-16",
        expected_tomorrow: "2025-06-17",
        actual_today: formatDate(chinaTime),
        actual_tomorrow: formatDate(tomorrow),
        dates_match: formatDate(chinaTime) === '2025-06-16' && formatDate(tomorrow) === '2025-06-17'
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result, null, 2)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        stack: error.stack
      }, null, 2)
    };
  }
}; 