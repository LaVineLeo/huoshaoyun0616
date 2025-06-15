document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const beijingTimeElement = document.getElementById('beijing-time');
    const vividnessElement = document.getElementById('vividness');
    const aerosolElement = document.getElementById('aerosol');
    const uncertaintyElement = document.getElementById('uncertainty');
    const currentCityElement = document.getElementById('current-city');
    const timeTypeElement = document.getElementById('time-type');
    const currentDateElement = document.getElementById('current-date');
    const cityInput = document.getElementById('city_input');
    const cityList = document.getElementById('city_list');
    const dateSelect = document.getElementById('date-select');
    const timeTypeSelect = document.getElementById('time-type-select');
    const searchButton = document.getElementById('search-btn');
    const refreshButton = document.getElementById('refresh-btn');
    const saveButton = document.getElementById('save-btn');
    const clearHistoryButton = document.getElementById('clear-history-btn');
    const statusMessage = document.getElementById('status-message');
    const historyList = document.getElementById('history-list');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const sunsetImage = document.getElementById('sunset-image');
    const imageCaption = document.getElementById('image-caption');
    
    // 参数说明弹窗元素
    const paramInfoBtn = document.getElementById('param-info-btn');
    const paramModal = document.getElementById('param-modal');
    const closeModalBtn = paramModal.querySelector('.close');

    // API地址 - 使用Netlify Functions
    const API_URL = '/.netlify/functions/sunset-data';
    const CITIES_API_URL = '/.netlify/functions/cities';
    
    // 当前数据
    let currentData = null;
    
    // 当前查询参数
    let currentCity = '深圳';
    let currentDate = 'today';
    let currentTimeType = 'set';  // 修改默认为日落

    // 初始加载数据
    fetchSunsetData();
    
    // 加载城市列表
    fetchCities();
    
    // 加载历史记录
    loadHistory();

    // 添加事件监听器
    refreshButton.addEventListener('click', fetchSunsetData);
    saveButton.addEventListener('click', saveToHistory);
    clearHistoryButton.addEventListener('click', clearHistory);
    searchButton.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // 添加日期和时间类型选择器的事件监听器
    dateSelect.addEventListener('change', () => {
        currentDate = dateSelect.value;
        fetchSunsetData();
    });
    
    timeTypeSelect.addEventListener('change', () => {
        currentTimeType = timeTypeSelect.value;
        fetchSunsetData();
    });
    
    // 参数说明弹窗事件处理
    paramInfoBtn.addEventListener('click', () => {
        paramModal.style.display = 'block';
    });
    
    closeModalBtn.addEventListener('click', () => {
        paramModal.style.display = 'none';
    });
    
    // 点击弹窗外部关闭弹窗
    window.addEventListener('click', (event) => {
        if (event.target === paramModal) {
            paramModal.style.display = 'none';
        }
    });
    
    // 添加选项卡切换事件
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 更新内容显示
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    /**
     * 处理搜索
     */
    function handleSearch() {
        const city = cityInput.value.trim();
        const date = dateSelect.value;
        const timeType = timeTypeSelect.value;
        
        if (city) {
            currentCity = city;
            currentDate = date;
            currentTimeType = timeType;
            fetchSunsetData();
        } else {
            statusMessage.textContent = '请输入城市名称';
            statusMessage.className = 'status-message error';
            setTimeout(() => {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }, 3000);
        }
    }
    
    /**
     * 更新城市列表
     */
    window.update_city_list = function() {
        // 这个函数会被input的oninput事件调用
        // 在这里可以实现动态过滤城市列表的功能
        // 目前使用的是HTML5的datalist，不需要额外的JavaScript逻辑
    };
    
    /**
     * 获取城市列表
     */
    async function fetchCities() {
        try {
            const response = await fetch(CITIES_API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }
            
            const data = await response.json();
            
            // 清空现有选项
            cityList.innerHTML = '';
            
            // 添加城市选项
            data.cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                cityList.appendChild(option);
            });
        } catch (error) {
            console.error('获取城市列表失败:', error);
        }
    }

    /**
     * 从后端API获取火烧云数据
     */
    async function fetchSunsetData() {
        try {
            // 显示加载状态
            setLoadingState(true);
            statusMessage.textContent = '正在获取数据...';
            statusMessage.className = 'status-message';

            // 构建查询参数
            const params = new URLSearchParams({
                city: currentCity,
                date: currentDate,
                timeType: currentTimeType
            });
            
            // 发起API请求
            const url = `${API_URL}?${params.toString()}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }

            // 解析JSON响应
            const data = await response.json();
            
            // 检查API响应状态
            if (data.status === 'error') {
                throw new Error(data.message || '获取数据失败');
            }
            
            // 保存当前数据
            currentData = data;
            
            // 更新UI
            updateUI(data);
            
            // 显示成功消息
            statusMessage.textContent = '数据已成功更新';
            statusMessage.className = 'status-message success';
            
            // 3秒后清除状态消息
            setTimeout(() => {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }, 3000);
        } catch (error) {
            console.error('获取数据失败:', error);
            statusMessage.textContent = `获取数据失败: ${error.message}`;
            statusMessage.className = 'status-message error';
            
            // 重置UI为错误状态
            resetUI();
        } finally {
            // 恢复按钮状态
            setLoadingState(false);
        }
    }

    /**
     * 更新UI显示数据
     * @param {Object} data - 火烧云数据
     */
    function updateUI(data) {
        // 使用格式化数据更新UI
        if (data.formatted) {
            beijingTimeElement.textContent = data.formatted.beijingTime || '获取失败';
            vividnessElement.textContent = data.formatted.vividness || '获取失败';
            aerosolElement.textContent = data.formatted.aerosol || '获取失败';
            uncertaintyElement.textContent = data.formatted.uncertainty || '获取失败';
            currentCityElement.textContent = data.formatted.city || currentCity;
            timeTypeElement.textContent = data.formatted.timeType || (currentTimeType === 'rise' ? '日出' : '日落');
            currentDateElement.textContent = data.formatted.date || (currentDate === 'today' ? '今天' : '明天');
        } else {
            // 直接解析新格式
            beijingTimeElement.textContent = data.tb_event_time ? data.tb_event_time.replace('<br>', ' ') : '获取失败';
            vividnessElement.textContent = data.tb_quality ? data.tb_quality.replace('<br>', ' ') : '获取失败';
            aerosolElement.textContent = data.tb_aod ? data.tb_aod.replace('<br>', ' ') : '获取失败';
            uncertaintyElement.textContent = '太复杂了不会算';
            currentCityElement.textContent = data.place_holder || currentCity;
            timeTypeElement.textContent = data.time_type === 'set' ? '日落' : '日出';
            currentDateElement.textContent = currentDate === 'today' ? '今天' : '明天';
        }
        
        // 更新图片和标题
        if (sunsetImage && data.img_href) {
            // 直接使用API返回的完整图片URL
            sunsetImage.src = data.img_href;
            sunsetImage.alt = `${data.place_holder || currentCity}火烧云预测图`;
            
            // 处理图片加载错误
            sunsetImage.onerror = function() {
                console.error('图片加载失败:', sunsetImage.src);
                sunsetImage.src = 'placeholder.jpg';
                sunsetImage.alt = '图片加载失败';
                imageCaption.textContent = '图片加载失败，请稍后重试';
            };
            
            // 更新图片标题
            if (imageCaption) {
                // 显示图片摘要和备注信息
                const summaryText = data.img_summary || '';
                const remarkText = data.remark || (data.formatted && data.formatted.remark) || '';
                imageCaption.textContent = `${summaryText}${remarkText ? ` (${remarkText})` : ''}`;
            }
        }
    }
    
    /**
     * 解码HTML实体
     * @param {string} html - 包含HTML实体的字符串
     * @returns {string} 解码后的字符串
     */
    function decodeHtmlEntities(html) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
    }
    
    /**
     * 去除HTML标签
     * @param {string} html - 包含HTML标签的字符串
     * @returns {string} 去除标签后的纯文本
     */
    function stripHtmlTags(html) {
        return html.replace(/<\/?[^>]+(>|$)/g, '');
    }

    /**
     * 重置UI为默认状态
     */
    function resetUI() {
        beijingTimeElement.textContent = '获取失败';
        vividnessElement.textContent = '获取失败';
        aerosolElement.textContent = '获取失败';
        uncertaintyElement.textContent = '获取失败';
        currentCityElement.textContent = currentCity;
        timeTypeElement.textContent = currentTimeType === 'rise' ? '日出' : '日落';
        currentDateElement.textContent = currentDate === 'today' ? '今天' : '明天';
        
        // 重置图片
        if (sunsetImage) {
            sunsetImage.src = 'placeholder.jpg';
            sunsetImage.alt = '暂无图片';
        }
        
        // 重置图片标题
        if (imageCaption) {
            imageCaption.textContent = '暂无数据';
        }
    }

    /**
     * 设置加载状态
     * @param {boolean} isLoading - 是否正在加载
     */
    function setLoadingState(isLoading) {
        refreshButton.disabled = isLoading;
        searchButton.disabled = isLoading;
        dateSelect.disabled = isLoading;
        timeTypeSelect.disabled = isLoading;
        refreshButton.textContent = isLoading ? '加载中...' : '刷新数据';
        
        if (isLoading) {
            beijingTimeElement.textContent = '加载中...';
            vividnessElement.textContent = '加载中...';
            aerosolElement.textContent = '加载中...';
            uncertaintyElement.textContent = '加载中...';
            currentDateElement.textContent = currentDate === 'today' ? '今天' : '明天';
            
            // 更新图片加载状态
            if (imageCaption) {
                imageCaption.textContent = '加载中...';
            }
        }
    }
    
    /**
     * 保存当前数据到历史记录
     */
    function saveToHistory() {
        if (!currentData) {
            statusMessage.textContent = '没有可保存的数据';
            statusMessage.className = 'status-message error';
            setTimeout(() => {
                statusMessage.textContent = '';
                statusMessage.className = 'status-message';
            }, 3000);
            return;
        }
        
        // 准备要保存的数据
        let historyData;
        
        if (currentData.formatted) {
            // 使用格式化数据
            historyData = {
                ...currentData.formatted,
                savedAt: new Date().toLocaleString(),
                img_href: currentData.img_href || '',
                img_summary: currentData.img_summary || '',
                remark: currentData.remark || currentData.formatted.remark || ''
            };
        } else {
            // 直接解析新格式
            historyData = {
                beijingTime: currentData.tb_event_time ? currentData.tb_event_time.replace('<br>', ' ') : '获取失败',
                vividness: currentData.tb_quality ? currentData.tb_quality.replace('<br>', ' ') : '获取失败',
                aerosol: currentData.tb_aod ? currentData.tb_aod.replace('<br>', ' ') : '获取失败',
                uncertainty: '太复杂了不会算',
                city: currentData.place_holder || currentCity,
                timeType: currentData.time_type === 'set' ? '日落' : '日出',
                savedAt: new Date().toLocaleString(),
                img_href: currentData.img_href || '',
                img_summary: currentData.img_summary || '',
                remark: currentData.remark || ''
            };
        }
        
        // 从本地存储获取现有历史记录
        let history = JSON.parse(localStorage.getItem('sunsetHistory') || '[]');
        
        // 添加新记录
        history.unshift(historyData);
        
        // 限制历史记录数量
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // 保存到本地存储
        localStorage.setItem('sunsetHistory', JSON.stringify(history));
        
        // 更新历史记录显示
        loadHistory();
        
        // 显示成功消息
        statusMessage.textContent = '数据已保存到历史记录';
        statusMessage.className = 'status-message success';
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }, 3000);
    }
    
    /**
     * 加载历史记录
     */
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem('sunsetHistory') || '[]');
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="no-data">暂无历史数据</p>';
            return;
        }
        
        // 清空历史列表
        historyList.innerHTML = '';
        
        // 添加历史记录
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            // 构建历史记录HTML
            let historyHtml = `
                <h4>记录时间: ${item.savedAt}</h4>
                <p>城市: ${item.city || '未知'}</p>
                <p>时间: ${item.beijingTime}</p>
                <p>类型: ${item.timeType || '日出'}</p>
                <p>鲜艳度: ${item.vividness}</p>
                <p>气溶胶: ${item.aerosol}</p>
                <p>不确定性: ${item.uncertainty}</p>
            `;
            
            // 如果有备注信息，添加到历史记录中
            if (item.remark) {
                historyHtml += `<p>备注: ${item.remark}</p>`;
            }
            
            // 如果有图片链接，添加缩略图
            if (item.img_href) {
                historyHtml += `
                    <div class="history-image-container">
                        <img src="${item.img_href}" alt="${item.city || '未知'}火烧云图" class="history-image" onerror="this.src='placeholder.jpg'; this.alt='图片加载失败';">
                        <p class="history-image-caption">${item.img_summary || ''}</p>
                    </div>
                `;
            }
            
            historyItem.innerHTML = historyHtml;
            historyList.appendChild(historyItem);
        });
    }
    
    /**
     * 清除历史记录
     */
    function clearHistory() {
        // 清除本地存储
        localStorage.removeItem('sunsetHistory');
        
        // 更新显示
        historyList.innerHTML = '<p class="no-data">暂无历史数据</p>';
        
        // 显示成功消息
        statusMessage.textContent = '历史记录已清除';
        statusMessage.className = 'status-message success';
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }, 3000);
    }
}); 