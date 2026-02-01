document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Features ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetHeader = document.querySelector(targetId);
            if (targetHeader) {
                window.scrollTo({
                    top: targetHeader.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    if (typeof GLightbox !== 'undefined') {
        GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            autoplayVideos: true
        });
    }

    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const annualExpense = parseFloat(document.getElementById('annual-expense').value) || 0;
            const currentAssets = parseFloat(document.getElementById('current-assets').value) || 0;
            const returnRate = (parseFloat(document.getElementById('return-rate').value) || 0) / 100;
            const inflationRate = (parseFloat(document.getElementById('inflation-rate').value) || 0) / 100;
            const realReturn = returnRate - inflationRate;
            const fireTarget = annualExpense / (realReturn || 0.04);
            const fireProgress = fireTarget > 0 ? (currentAssets / fireTarget) * 100 : 0;
            const resultArea = document.getElementById('calculator-results');
            if (resultArea) {
                resultArea.innerHTML = `
                    <div class="result-card ${fireProgress >= 100 ? 'success' : 'warning'}">
                        <h3>財務自由進度：${fireProgress.toFixed(1)}%</h3>
                        <p>目標金額：${Math.round(fireTarget).toLocaleString()} 萬元</p>
                        <p>${fireProgress >= 100 ? '恭喜！您已達成財務自由！' : '加油！持續累積資產，離目標更近一步。'}</p>
                    </div>
                `;
                resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // --- Patent AI Analysis Logic ---
    const patentInput = document.getElementById('patent-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultsArea = document.getElementById('analysis-results');
    const loaderArea = document.getElementById('analysis-loader');
    const progressBar = document.getElementById('progress-bar');
    const statusText = document.getElementById('status-text');
    const statusPercentage = document.getElementById('status-percentage');
    const settingsBtn = document.getElementById('settings-btn');
    const apiKeyModal = document.getElementById('api-key-modal');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveKeyBtn = document.getElementById('save-api-key');
    const closeKeyBtn = document.getElementById('close-modal');

    // --- Demo Data ---
    const demoData = {
        "US11000000B2": {
            "patent_no": "US11000000B2",
            "patent_name": "Method and apparatus for facilitating handover in a wireless communication system",
            "assignee": "XXX",
            "summary_original": "A method and apparatus for facilitating handover in a wireless communication system by optimizing measurement reports and threshold evaluations.",
            "summary_layman": "提高行動通訊切換基地台時的穩定性，大幅減少斷線風險與延遲。",
            "expiry_date": "2031-12-01 (預估)",
            "claim_1": "1. A method comprising: receiving a handover command; evaluating a signal strength threshold; and initiating communication with a target base station.",
            "claim_elements": [
                { "element": "Receiving unit", "analysis": "接收並解析基地台發送的切換指令" },
                { "element": "Evaluation logic", "analysis": "動態判斷訊號強度是否達到切換門檻" },
                { "element": "Initiation module", "analysis": "模組化執行與目標基地台的握手程序" }
            ],
            "sep_check": "高風險 SEP (5G/NR)",
            "sep_details": "涉及 3GPP TS 38.331 章節之 RRC 重連機制，為 5G 必要核心專利。"
        },
        "US11716756B2": {
            "patent_no": "US11716756B2",
            "patent_name": "Data communication method and apparatus for performing spatial reuse",
            "assignee": "Huawei Technologies Co., Ltd. (華為)",
            "summary_original": "Embodiments of the present disclosure disclose a data communication method and apparatus. The data communication method includes: when receiving a PPDU, obtaining, by a network node, a BSS identifier in the PPDU; if the BSS identifier in the PPDU is different from a first BSS identifier, and the BSS identifier in the PPDU is the same as a second BSS identifier, determining whether the PPDU meets a preset spatial reuse condition, where the first BSS identifier is an identifier of a first BSS to which the network node belongs, the second BSS identifier is an identifier of an extended BSS to which a target relay belongs, and the target relay and the network node belong to the first BSS; and if the PPDU meets the preset spatial reuse condition, contending for an access channel, and communicating with a station other than the target relay in the first BSS.",
            "summary_layman": "這是一項關於無線區域網路中數據傳輸的技術。當裝置接收到一個數據包時，會識別其 BSS ID。如果該 ID 與自己所屬的系統一致但屬於特定中繼站，且符合空間複用條件，裝置就可以主動競爭信道與同系統內的其他設備通信，有效提升網路效率。",
            "expiry_date": "2037-09-15 (Adjusted expiration)",
            "claim_1": "1. A data communication apparatus, applied in a wireless local area network, wherein the data communication apparatus comprises a processor and a memory that stores computer executable program code, the program code includes an instruction, and when the processor executes the instruction, the instruction enables the data communication apparatus to perform operations comprising: [See breakdown in elements]",
            "claim_elements": [
                { "element": "1. A data communication apparatus, applied in a wireless local area network, wherein the data communication apparatus comprises a processor and a memory that stores computer executable program code, the program code includes an instruction, and when the processor executes the instruction, the instruction enables the data communication apparatus to perform operations comprising:", "analysis": "定義專利主體為一種通訊裝置，應用於無線區域網路 (WLAN)，包含處理器與儲存程式碼的記憶體。" },
                { "element": "receiving a preset frame sent by a station (STA) associated with the data communication apparatus, wherein the data communication apparatus and the STA belong to a first basic service set (BSS) having a first BSS identifier, and the preset frame comprises a second BSS identifier that identifies a second BSS;", "analysis": "步驟一：接收相關聯站點發送的預設幀。這裡定義了「第一 BSS」(主系統) 與其中的「第二 BSS」(中繼或擴展系統) 的識別關係。" },
                { "element": "receiving a physical layer protocol data unit (PPDU), wherein the PPDU comprises a target BSS identifier; and", "analysis": "步驟二：接收一個物理層協定數據單元 (PPDU)，並提取其中標註的目標 BSS 識別碼。" },
                { "element": "sending a frame to another STA other than the STA in the first BSS, in response to the target BSS identifier being same as the second BSS identifier and different from the first BSS identifier, and a preset condition being met.", "analysis": "步驟三：關鍵決策。當目標 ID 屬於預設的第二 BSS (但非主 BSS) 且符合預設條件時，執行發送動作，實現不同節點間的並行通信。" }
            ],
            "sep_check": "潛在 SEP (Wi-Fi 6/7)",
            "sep_details": "該技術精確描述了 BSS 識別與 Spatial Reuse 的觸發機制，屬於 IEEE 802.11ax/be 系列標準的核心通訊專利。"
        }
    };

    let cachedModelList = null;

    if (apiKeyInput) {
        apiKeyInput.value = localStorage.getItem('gemini_api_key') || '';
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            apiKeyModal.style.display = apiKeyModal.style.display === 'none' ? 'block' : 'none';
        });
    }

    document.addEventListener('click', (e) => {
        if (apiKeyModal && !apiKeyModal.contains(e.target) && e.target !== settingsBtn) {
            apiKeyModal.style.display = 'none';
        }
    });

    if (saveKeyBtn) {
        saveKeyBtn.addEventListener('click', () => {
            const key = apiKeyInput.value.trim();
            if (key) {
                localStorage.setItem('gemini_api_key', key);
                apiKeyModal.style.display = 'none';
                alert('API Key 已儲存');
                cachedModelList = null;
            } else {
                alert('請輸入有效的 API Key');
            }
        });
    }

    if (closeKeyBtn) {
        closeKeyBtn.addEventListener('click', () => {
            apiKeyModal.style.display = 'none';
        });
    }

    async function getAvailableModels(key) {
        // --- Persistence Cache: Save to localStorage to survive refreshes ---
        const cacheKey = 'gemini_models_cache';
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const { models, timestamp } = JSON.parse(cached);
                // 1 小時內不需要重新抓取
                if (Date.now() - timestamp < 3600000) return models;
            } catch (e) {
                localStorage.removeItem(cacheKey);
            }
        }

        console.log("正在從雲端更新可用模型清單 (包含快取檢查)...");
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.models) {
                const modelList = data.models
                    .filter(m => m.supportedGenerationMethods.includes('generateContent'))
                    .map(m => m.name.replace('models/', ''));

                console.log("您的帳號目前支援以下模型：");
                console.table(modelList);

                localStorage.setItem(cacheKey, JSON.stringify({ models: modelList, timestamp: Date.now() }));
                return modelList;
            }
        } catch (e) {
            console.error("模型清單實時更新失敗，將嘗試使用快取或備援名單:", e);
        }
        return ['gemini-1.5-flash-latest', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'];
    }

    function normalizePatentNo(input) {
        return input.toUpperCase().replace(/[\s\/,]/g, '');
    }

    function updateProgress(percentage, message) {
        if (progressBar) progressBar.style.width = percentage + '%';
        if (statusText) statusText.innerText = message;
        if (statusPercentage) statusPercentage.innerText = percentage + '%';
    }

    function robustParseJSON(text) {
        try {
            // First pass: standard cleanup
            let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            try {
                return JSON.parse(cleanText);
            } catch (e) {
                // Second pass: find boundaries
                const start = text.indexOf('{');
                const end = text.lastIndexOf('}');
                if (start !== -1 && end !== -1) {
                    const jsonStr = text.substring(start, end + 1);
                    return JSON.parse(jsonStr);
                }
                throw e;
            }
        } catch (e) {
            console.error("JSON 解析失敗，原始文本：", text);
            throw new Error("AI 回傳格式不正確 (JSON 解析失敗)");
        }
    }

    let lastSuccessfulPatent = null;
    let lastSuccessfulData = null;

    const startAnalysis = async () => {
        const rawNo = patentInput.value.trim();
        if (!rawNo) {
            alert('請輸入專利號');
            return;
        }

        const patentNo = normalizePatentNo(rawNo);

        // --- Cache Check: Avoid redundant API calls if patent is same ---
        if (patentNo === lastSuccessfulPatent && lastSuccessfulData) {
            displayAnalysis(lastSuccessfulData);
            return;
        }

        // --- Demo Match ---
        if (demoData[patentNo]) {
            analyzeBtn.disabled = true;
            loaderArea.style.display = 'block';
            resultsArea.style.display = 'none';
            updateProgress(30, '正在從內部資料庫檢索範例數據...');
            setTimeout(() => {
                updateProgress(100, '分析完成！');
                displayAnalysis(demoData[patentNo]);
                setTimeout(() => {
                    loaderArea.style.display = 'none';
                    analyzeBtn.disabled = false;
                }, 800);
            }, 800);
            return;
        }

        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            alert('這是外部專利號碼，請先設定 API Key 以啟用 AI 分析。');
            apiKeyModal.style.display = 'block';
            return;
        }

        analyzeBtn.disabled = true;
        loaderArea.style.display = 'block';
        resultsArea.style.display = 'none';
        updateProgress(5, '正在探測可用 AI 模型...');

        try {
            // --- Smart Model Selection: Use discoverable models to avoid 404 ---
            const availableModels = await getAvailableModels(apiKey);
            if (!availableModels || availableModels.length === 0) {
                throw new Error("您的 API Key 目前似乎沒有可用的 Gemini 模型清單。");
            }

            // 選取邏輯：強烈鎖定穩定的 1.5-flash 系列，避開尚不穩定的新版/實驗版模型
            const selectedModel = availableModels.find(m => m === 'gemini-1.5-flash-latest') ||
                availableModels.find(m => m === 'gemini-1.5-flash') ||
                availableModels.find(m => m.includes('1.5-flash')) ||
                availableModels[0];

            console.log(`[智慧選核] 已為您的帳號自動選取高穩定模型：${selectedModel}`);
            updateProgress(20, `正在使用 ${selectedModel} 進行檢索與分析...`);

            const result = await callGeminiPatentAPI(apiKey, patentNo, selectedModel);

            if (!result || result.error) {
                throw new Error(result?.error || '分析過程發生未知錯誤');
            }

            if (result.notFound) {
                alert('案號可能有誤或查無公開資料');
                loaderArea.style.display = 'none';
                analyzeBtn.disabled = false;
                return;
            }

            updateProgress(80, '正在生成法律與技術分析報表...');
            displayAnalysis(result);
            lastSuccessfulPatent = patentNo;
            lastSuccessfulData = result;

            updateProgress(100, '分析完成！');
            setTimeout(() => {
                loaderArea.style.display = 'none';
                analyzeBtn.disabled = false;
            }, 1000);

        } catch (error) {
            console.error('Final Analysis Error:', error);
            let errMsg = error.message;
            if (errMsg.includes('quota') || errMsg.includes('429')) {
                const retryMatch = errMsg.match(/retry in ([\d\.]+)s/);
                let seconds = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) : 60;

                // --- Quota Cooldown UI ---
                analyzeBtn.disabled = true;
                const originalText = "開始 AI 分析";
                const timer = setInterval(() => {
                    seconds--;
                    analyzeBtn.innerText = `冷卻中 (${seconds}s)...`;
                    if (seconds <= 0) {
                        clearInterval(timer);
                        analyzeBtn.innerText = originalText;
                        analyzeBtn.disabled = false;
                    }
                }, 1000);

                errMsg = `API 流量暫時用盡。請等待按鈕倒數結束後再試，以確保配額重置。`;
            }
            alert('分析失敗：' + errMsg);
            loaderArea.style.display = 'none';
            if (!errMsg.includes('冷卻')) analyzeBtn.disabled = false;
        }
    };

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', startAnalysis);
    }

    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            patentInput.value = tag.getAttribute('data-patent');
            startAnalysis();
        });
    });

    async function callGeminiPatentAPI(apiKey, patentNo, modelId) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

        const systemInstruction = `你是專業的專利分析助理，擅長擷取搜尋結果並產出結構化報告。
你的主要任務：針對專利號 ${patentNo} 進行搜尋，並將結果轉換為 JSON 格式。`;

        const requestBody = {
            contents: [{
                role: "user",
                parts: [{
                    text: `請分析華為專利 ${patentNo}。
1. 使用工具搜尋該專利的正式名稱、專利權人、摘要與 Claim 1。
2. 搜尋後，請先簡短總結該技術在 Wi-Fi 6 (Spatial Reuse) 中的關鍵地位。
3. 最後務必嚴格輸出以下 JSON 格式報表。

\`\`\`json
{
  "patent_no": "${patentNo}",
  "patent_name": "正確標題",
  "assignee": "Huawei Technologies Co., Ltd.",
  "summary_original": "英文摘要",
  "summary_layman": "中文分析",
  "expiry_date": "YYYY-MM-DD",
  "claim_1": "Claim 1 文本",
  "claim_elements": [{"element": "...", "analysis": "..."}],
  "sep_check": "高風險 SEP (Wi-Fi 6)",
  "sep_details": "技術細節說明...",
  "notFound": false
}
\`\`\`` }]
            }],
            tools: [{ google_search: {} }],
            system_instruction: { parts: [{ text: systemInstruction }] },
            generationConfig: {
                temperature: 0.4,
                topP: 0.9,
                maxOutputTokens: 3500
            }
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            // --- CRITICAL DEBUG LOG ---
            console.log("Gemini API Raw Full Response:", data);

            if (!response.ok) {
                return { error: data.error?.message || `API 執行失敗 (${response.status})` };
            }

            if (data.candidates && data.candidates[0]) {
                const candidate = data.candidates[0];
                const reason = candidate.finishReason;

                if (reason === 'SAFETY') return { error: "內容因安全過濾被拒絕回傳" };
                if (reason === 'RECITATION') return { error: "內容因版權引用限制無法回傳" };

                // 合理化擷取：包含 text 與 thought (針對 Gemini 2.0 Thinking 模型)
                const contentParts = candidate.content?.parts || [];
                const combinedText = contentParts
                    .map(p => p.text || p.thought || '')
                    .join('\n')
                    .trim();

                // --- DEBUG LOG FOR AI REASONING ---
                console.log("AI 回應完整文本內容：\n", combinedText);

                if (combinedText) {
                    try {
                        const parsed = robustParseJSON(combinedText);
                        if (parsed.notFound) {
                            return { error: `查無此案號 (${patentNo}) 的公開資料，請確認號碼是否正確。` };
                        }
                        return parsed;
                    } catch (e) {
                        return { error: `分析結果解析異常: ${e.message}` };
                    }
                } else {
                    // --- 診斷邏輯 ---
                    console.warn("[診斷] 偵測到空文本，完整 Candidate 內容如下：\n", JSON.stringify(candidate, null, 2));

                    // 如果有 groundingMetadata 但沒有文本，可能需要強迫模型總結
                    if (candidate.groundingMetadata) {
                        return { error: "AI 已找到專利資料，但未能生成分析報表。這通常與模型選擇或 API 策略有關，建議更換為 'gemini-1.5-flash' 或稍後再試。" };
                    }

                    return { error: `AI 回應無內容 (原因: ${reason || 'UNKNOWN'})。` };
                }
            }
            return { error: "AI 未回傳任何有效內容 (Candidates Empty)" };
        } catch (e) {
            console.error("網路請求異常：", e);
            return { error: `網路連線異常: ${e.message}` };
        }
    }

    function calculateCountdown(expiryDateStr) {
        if (!expiryDateStr) return { years: 0, months: 0, days: 0 };
        const datePart = expiryDateStr.split(' ')[0];
        const now = new Date();
        const expiry = new Date(datePart);
        if (isNaN(expiry)) return { years: 0, months: 0, days: 0 };
        const diff = expiry - now;
        if (diff <= 0) return { years: 0, months: 0, days: 0 };
        let years = expiry.getFullYear() - now.getFullYear();
        let months = expiry.getMonth() - now.getMonth();
        let days = expiry.getDate() - now.getDate();
        if (days < 0) {
            months -= 1;
            const prevMonth = new Date(expiry.getFullYear(), expiry.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }
        return { years, months, days };
    }

    function displayAnalysis(data) {
        const countdown = calculateCountdown(data.expiry_date);
        resultsArea.innerHTML = `
            <div class="a-card result-card-full">
                <h4><i data-lucide="info"></i> 專利概覽：${data.patent_no}</h4>
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(var(--primary-rgb, 67, 97, 238), 0.05); border-left: 4px solid var(--primary-color); border-radius: 4px;">
                    <strong style="color: var(--primary-color);">專利名稱：</strong> ${data.patent_name || '未提供'}
                </div>
                <div class="summary-contrast">
                    <div class="summary-box">
                        <span class="type"><i data-lucide="file-text"></i> 摘要原文</span>
                        <p>${data.summary_original || '無資料'}</p>
                    </div>
                    <div class="summary-box">
                        <span class="type"><i data-lucide="sparkles"></i> AI 白話翻譯</span>
                        <p>${data.summary_layman || '無資料'}</p>
                    </div>
                </div>
                <div style="margin-top: 15px; font-size: 0.9rem; color: var(--text-secondary);">
                    <strong>申請人：</strong> ${data.assignee || '未知'}
                </div>
            </div>
            <div class="a-card">
                <h4><i data-lucide="calendar"></i> 權利期限</h4>
                <div class="expiry-content">
                    <div class="expiry-date-val">預計到期日：${data.expiry_date || '未提供'}</div>
                    <div class="countdown-grid">
                        <div class="countdown-unit">
                            <span class="countdown-val">${countdown.years}</span>
                            <span class="countdown-label">年</span>
                        </div>
                        <div class="countdown-unit">
                            <span class="countdown-val">${countdown.months}</span>
                            <span class="countdown-label">月</span>
                        </div>
                        <div class="countdown-unit">
                            <span class="countdown-val">${countdown.days}</span>
                            <span class="countdown-label">日</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="a-card">
                <h4><i data-lucide="shield-check"></i> SEP 標準技術檢測</h4>
                <div class="sep-alert">
                    <i data-lucide="alert-triangle"></i>
                    <div class="sep-content">
                        <h5>${data.sep_check || '監測中'}</h5>
                        <p>${data.sep_details || '正在對比標準文獻...'}</p>
                    </div>
                </div>
            </div>
            <div class="a-card result-card-full">
                <h4><i data-lucide="gantt-chart"></i> 侵權風險預判 (Claim 1 分析)</h4>
                <div class="summary-box" style="margin-bottom: 20px; background: white; border: 1px solid var(--border-color);">
                    <span class="type">獨立項第一項原文</span>
                    <p style="font-family: monospace; font-size: 0.85rem;">${data.claim_1 || '無權利項資料'}</p>
                </div>
                <div class="ebe-container">
                    <table class="ebe-table">
                        <thead>
                            <tr>
                                <th>權利項元件 (Element)</th>
                                <th>技術特徵分析 (白話轉譯)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(data.claim_elements || []).map(item => `
                                <tr>
                                    <td><strong>${item.element}</strong></td>
                                    <td>${item.analysis}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        resultsArea.style.display = 'grid';
        lucide.createIcons();
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
