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

  // 返回标准响应格式
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ 
      message: 'Hello from Netlify Functions!',
      method: event.httpMethod,
      path: event.path,
      timestamp: new Date().toISOString()
    })
  };
}; 