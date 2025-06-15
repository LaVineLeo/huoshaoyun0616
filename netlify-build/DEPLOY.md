# 🌅 火烧云分析 - Netlify部署包

## 📦 部署说明

这是一个可以直接拖拽到Netlify部署的静态网站包。

### 🚀 快速部署步骤

1. **打包完成**：此文件夹已包含所有必要文件
2. **拖拽部署**：将整个 `netlify-build` 文件夹拖拽到 [Netlify](https://app.netlify.com/drop) 
3. **自动构建**：Netlify会自动识别配置并部署
4. **验证Functions**：
   - 基础测试：`https://your-site-name.netlify.app/.netlify/functions/hello`
   - 🕐 时间校准：`https://your-site-name.netlify.app/.netlify/functions/time-debug`

### 📁 文件结构

```
netlify-build/
├── index.html              # 主页面
├── styles.css              # 样式文件  
├── script.js               # 前端脚本（已修改API路径）
├── logo.png                # 网站图标
├── netlify.toml            # Netlify配置文件（已修复）
├── package.json            # 依赖配置（已简化）
├── DEPLOY.md               # 部署说明
└── functions/              # Netlify Functions目录
    ├── hello.js            # 测试函数（验证部署）
    ├── time-debug.js       # 时间调试函数（中国时间校准）
    ├── sunset-data.js      # 火烧云数据API（已优化，支持中国时间）
    └── cities.js           # 城市列表API
```

### ⚡ 功能特性

- ✅ 静态前端 + Serverless Functions
- ✅ 自动CORS配置
- ✅ API路径重定向（/api/* → /.netlify/functions/*）
- ✅ 安全头配置
- ✅ 移动端适配

### 🔧 技术栈

- **前端**：HTML5 + CSS3 + Vanilla JavaScript
- **后端**：Netlify Functions (Node.js)
- **部署**：Netlify静态站点托管

### 🔧 v1.2优化说明（基于Netlify最佳实践）

**参考文档**：[Netlify无服务器函数部署指南](https://houbb.github.io/2024/09/19/free-backend-04-Netlify-intro)

**最新优化**：
- ✅ 按照Netlify标准格式重构Functions
- ✅ 添加测试函数`hello.js`便于验证部署
- ✅ 🕐 **修正时间处理逻辑，支持中国时间（UTC+8）校准**
- ✅ 🔍 添加`time-debug.js`用于时间验证
- ✅ 优化CORS处理和响应格式
- ✅ 添加esbuild打包器配置
- ✅ 完全符合Netlify Functions规范

### 📝 注意事项

1. 首次部署可能需要2-3分钟初始化Functions
2. API数据为模拟数据，可根据需要修改Functions中的逻辑
3. 支持自定义域名绑定
4. **重要**：请重新部署以应用Functions修复

---

**Created by LaVine** | 基于原Express应用改造 