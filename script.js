document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Features ---
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active');
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
            navLinks.classList.toggle('active');
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
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('pdf-file-input');
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

    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    // --- PDF Text Extraction Logic ---
    async function extractTextFromPDF(file) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = "";
        const totalPages = pdf.numPages;

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            fullText += pageText + "\n";
            const progress = Math.round((i / totalPages) * 100);
            updateProgress(Math.round(progress * 0.3), `正在讀取 PDF 文字 (第 ${i}/${totalPages} 頁)...`);
        }
        return fullText;
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
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // --- 進階防禦性修復：處理引號、尾端逗號與閉合括號 ---
        let inString = false;
        let escaped = false;
        let stack = [];

        for (let i = 0; i < cleanText.length; i++) {
            const char = cleanText[i];

            if (char === '"' && !escaped) {
                inString = !inString;
            }

            if (inString) {
                if (char === '\\') escaped = !escaped;
                else escaped = false;
                continue;
            }

            if (char === '{') stack.push('}');
            else if (char === '[') stack.push(']');
            else if (char === '}' || char === ']') {
                if (stack.length > 0 && stack[stack.length - 1] === char) {
                    stack.pop();
                }
            }
        }

        // 如果在字串內部截斷，先補上引號
        if (inString) {
            cleanText += '"';
        }

        // 移除末尾可能多餘的逗號 (針對極限截斷情形)
        cleanText = cleanText.trim().replace(/,$/, '');

        // 補齊缺失的括號
        if (stack.length > 0) {
            const closing = stack.reverse().join('');
            console.warn("[JSON 修復] 偵測到截斷，正在補完結構:", closing);
            cleanText += closing;
        }

        try {
            return JSON.parse(cleanText);
        } catch (e) {
            // 保底解決方案：提取最外層完整對象
            const start = cleanText.indexOf('{');
            const end = cleanText.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                try {
                    return JSON.parse(cleanText.substring(start, end + 1));
                } catch (e2) { }
            }
            console.error("JSON 解析失敗，原始文本：", text);
            throw new Error("AI 回傳報告過長導致截斷，已嘗試修復但仍失敗，請減少字數需求或重試。");
        }
    }



    const handleFileSelect = async (file) => {
        if (!file || file.type !== 'application/pdf') {
            alert('請上傳 PDF 格式的檔案');
            return;
        }

        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            alert('請先設定 API Key 以啟用 AI 分析。');
            apiKeyModal.style.display = 'block';
            return;
        }

        loaderArea.style.display = 'block';
        resultsArea.style.display = 'none';
        updateProgress(5, '正在啟動 PDF 解析引擎...');

        try {
            const pdfText = await extractTextFromPDF(file);
            updateProgress(35, 'PDF 文字提取完成，正在呼叫 AI 深度分析...');

            // --- 恢復動態探索邏輯，以確保模型名稱百分之百正確 (動態修復 404) ---
            const availableModels = await getAvailableModels(apiKey);
            const selectedModel = availableModels.find(m => m === 'gemini-1.5-flash-latest') ||
                availableModels.find(m => m === 'gemini-1.5-flash') ||
                availableModels.find(m => m.includes('1.5-flash')) ||
                availableModels[0];

            updateProgress(45, `AI 資深專利師 (${selectedModel}) 正在進行深度分析...`);

            const result = await callGeminiPatentAPI(apiKey, pdfText, selectedModel);

            if (!result || result.error) {
                // --- 區域化 429 錯誤處理 ---
                if (result?.error?.includes('429')) {
                    statusText.innerHTML = '<span style="color: #e74c3c; font-weight: bold;">[流量繁忙] 請等待 30 秒後重新上傳或選取範例。</span>';
                    statusPercentage.innerText = "Error";
                    return;
                }
                throw new Error(result?.error || '分析過程發生未知錯誤');
            }

            updateProgress(90, '正在生成法律與技術分析報表...');
            displayAnalysis(result);

            updateProgress(100, '分析完成！');
            setTimeout(() => {
                loaderArea.style.display = 'none';
            }, 1000);

        } catch (error) {
            console.error('Final Analysis Error:', error);
            alert('分析失敗：' + error.message);
            loaderArea.style.display = 'none';
        }
    };

    if (uploadZone) {
        uploadZone.addEventListener('click', () => fileInput.click());
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            handleFileSelect(file);
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            handleFileSelect(file);
        });
    }

    const startDemoAnalysis = async (patentNo) => {
        if (demoData[patentNo]) {
            loaderArea.style.display = 'block';
            resultsArea.style.display = 'none';
            updateProgress(30, '正在從內部資料庫檢索範例數據...');
            setTimeout(() => {
                updateProgress(100, '分析完成！');
                displayAnalysis(demoData[patentNo]);
                setTimeout(() => {
                    loaderArea.style.display = 'none';
                }, 800);
            }, 800);
        }
    };



    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            startDemoAnalysis(tag.getAttribute('data-patent'));
        });
    });

    async function callGeminiPatentAPI(apiKey, pdfText, modelId) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

        const systemInstruction = `你是一位資深專利師。請閱讀使用者提供的專利說明書 PDF 文字內容，並精確輸出 JSON 格式資料。

重點要求：
1. 摘要內容：提供「完整」的英文摘要原文 (summary_original) 與深入淺出的中文白話說明 (summary_layman)。
2. 權利期限與母案識別 (嚴格法律實務)：
   - 識別申請日 (filing_date)。
   - **核心計壽準則**：識別首頁 (63) Related U.S. Application Data 欄位。
   - **排除臨時案**：如果最早的日期關聯的是「Provisional Application」(臨時申請案)，則「不可」將其作為 20 年權利期限的起算點。
   - **正確起算點**：找出最早的「Non-provisional」(正式申請案 / Continuation / Division) 的母案申請日，將其填入 parent_filing_date 欄位。
   - **到期日算法**：預估到期日 (expiry_date) = 最早「正式型」母案申請日 + 20年 + PTA天數。
3. SEP 標準技術檢測 (限正文，排除引證區)：
   - 僅搜尋說明書正文 (Specification) 提及的標準編號（如 802.11ax, TS 38.331 等）。
4. Claim 1 結構化拆解：拆解為 Preamble 與 Body，左欄英文原文，右欄中文翻譯。

請嚴格遵守以下 JSON 結構：
{
  "patent_no": "案號",
  "patent_name": "...",
  "assignee": "...",
  "filing_date": "YYYY-MM-DD",
  "parent_filing_date": "最早正式母案申請日 (排除臨時案)",
  "pta_days": "123",
  "expiry_date": "YYYY-MM-DD",
  "summary_original": "Complete English abstract...",
  "summary_layman": "...",
  "claim_1": "Full Claim 1 text",
  "claim_elements": [
    {"element": "Preamble in English", "analysis": "中文翻譯"},
    {"element": "Part in English", "analysis": "中文翻譯"}
  ],
  "sep_check": "涉及 SEP / 不涉及 SEP",
  "sep_details": "具體標準編號與正文技術描述..."
}`;

        const requestBody = {
            contents: [{
                role: "user",
                parts: [{
                    text: `以下是專利說明書 PDF 的提取文字內容：\n\n${pdfText.substring(0, 45000)}`
                }]
            }],
            system_instruction: { parts: [{ text: systemInstruction }] },
            generationConfig: {
                temperature: 0.1,
                topP: 0.95,
                maxOutputTokens: 4096, // 提升至 Flash 模型極限以應對大段原文
                response_mime_type: "application/json"
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
        // This function is no longer directly used for display, but kept for potential future use or debugging.
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
        resultsArea.innerHTML = `
            <div class="a-card result-card-full">
                <h4><i data-lucide="info"></i> 專利概覽：${data.patent_no}</h4>
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(var(--primary-rgb, 67, 97, 238), 0.05); border-left: 4px solid var(--primary-color); border-radius: 4px;">
                    <strong style="color: var(--primary-color);">專利名稱：</strong> ${data.patent_name || '未提供'}
                </div>
                <div style="margin-top: 15px; font-size: 0.9rem; color: var(--text-secondary);">
                    <strong>申請人：</strong> ${data.assignee || '未知'}
                </div>
            </div>
            <div class="a-card">
                <h4><i data-lucide="calendar"></i> 權利期限</h4>
                <div class="expiry-content">
                    <div class="expiry-date-val" style="line-height: 1.8;">
                        母案申請日：${data.parent_filing_date || data.filing_date || '未提供'}
                        <br>
                        本案申請日：${data.filing_date || '未提供'}
                        <br>
                        預計到期日：<span id="res-expiry" style="color: var(--primary-color); font-weight: bold;">未提供</span>
                    </div>
                </div>
            </div>
            <div class="a-card result-card-full">
                <h4><i data-lucide="file-text"></i> 摘要分析</h4>
                <div class="summary-contrast">
                    <div class="summary-box">
                        <span class="type"><i data-lucide="file-text"></i> 摘要原文</span>
                        <p id="res-summary-original">無資料</p>
                    </div>
                    <div class="summary-box">
                        <span class="type"><i data-lucide="sparkles"></i> AI 白話翻譯</span>
                        <p id="res-summary-layman">無資料</p>
                    </div>
                </div>
            </div>
            <div class="a-card result-card-full">
                <h4><i data-lucide="shield-check"></i> SEP 標準技術檢測</h4>
                <div id="res-sep-alert" class="sep-alert" style="display: flex; gap: 15px; background: #fffcf0; border: 1px solid #ffecb3; padding: 15px; border-radius: 8px;">
                    <i id="res-sep-icon" data-lucide="alert-circle" style="color: #f59e0b; flex-shrink: 0;"></i>
                    <div class="sep-content">
                        <h5 id="res-sep-check" style="margin: 0 0 8px 0; color: #92400e;">檢測中</h5>
                        <div id="res-sep-details" style="font-size: 0.9rem; color: #b45309; line-height: 1.6;">正在對比標準文獻...</div>
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
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">權利項元件 (原文)</th>
                                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">技術特徵分析 (白話翻譯)</th>
                            </tr>
                        </thead>
                        <tbody id="res-claim-elements">
                            <!-- Claim elements will be inserted here by JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // --- 權利期限與 PTA 處理 ---
        const filingDate = data.filing_date || "未知";
        const ptaDays = parseInt(data.pta_days) || 0;
        let expiryDateStr = data.expiry_date || "未知";
        let remainingText = "";

        if (expiryDateStr !== "未知") {
            const expiry = new Date(expiryDateStr);
            const now = new Date();
            const diffTime = expiry - now;
            const diffDaysTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDaysTotal > 0) {
                const years = Math.floor(diffDaysTotal / 365);
                const months = Math.floor(((diffDaysTotal % 365) / 30)); // Simplified month calculation
                const days = diffDaysTotal % 30;
                remainingText = ` (剩餘時間：${years}年${months}月${days}日)`;
            } else {
                remainingText = " (已屆期)";
            }
        }

        document.getElementById('res-expiry').innerText = `${expiryDateStr}${remainingText} (含 PTA: ${ptaDays}天)`;

        // --- 摘要與翻譯 ---
        document.getElementById('res-summary-original').innerText = data.summary_original || "無內容";
        document.getElementById('res-summary-layman').innerText = data.summary_layman || "無內容";

        // --- SEP 標準技術檢測處理 ---
        const sepCheckStr = data.sep_check || "未確認";
        const sepDetailsStr = data.sep_details || "正在解析說明書正文...";
        const sepCheckEl = document.getElementById('res-sep-check');
        const sepDetailsEl = document.getElementById('res-sep-details');
        const sepAlertEl = document.getElementById('res-sep-alert');
        const sepIconEl = document.getElementById('res-sep-icon');

        if (sepCheckEl) sepCheckEl.innerText = sepCheckStr;
        if (sepDetailsEl) sepDetailsEl.innerHTML = sepDetailsStr.replace(/\n/g, '<br>');

        if (sepCheckStr.includes('涉及 SEP')) {
            sepAlertEl.style.background = '#f0fff4';
            sepAlertEl.style.borderColor = '#c6f6d5';
            sepCheckEl.style.color = '#22543d';
            sepDetailsEl.style.color = '#2f855a';
            sepIconEl.setAttribute('data-lucide', 'check-circle');
            sepIconEl.style.color = '#38a169';
        } else if (sepCheckStr.includes('不涉及')) {
            sepAlertEl.style.background = '#f7fafc';
            sepAlertEl.style.borderColor = '#e2e8f0';
            sepCheckEl.style.color = '#2d3748';
            sepDetailsEl.style.color = '#4a5568';
            sepIconEl.setAttribute('data-lucide', 'info');
            sepIconEl.style.color = '#718096';
        }

        // --- Claim 1 拆解 (原文 vs 翻譯) ---
        const claimElementsBody = document.getElementById('res-claim-elements');
        claimElementsBody.innerHTML = '';
        if (data.claim_elements && Array.isArray(data.claim_elements)) {
            data.claim_elements.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="px-4 py-3 text-sm text-gray-700 border-b font-mono" style="background: #f8f9fa;">${item.element || '無原文'}</td>
                    <td class="px-4 py-3 text-sm text-gray-700 border-b">${item.analysis || '無翻譯'}</td>
                `;
                claimElementsBody.appendChild(tr);
            });
        }
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
