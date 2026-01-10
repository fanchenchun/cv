document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const isDisplaying = navLinks.style.display === 'flex';
            if (isDisplaying) {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }
        });
    }

    // Initialize GLightbox
    if (typeof GLightbox !== 'undefined') {
        const lightbox = GLightbox({
            selector: '.glightbox'
        });
    }

    // --- Financial Freedom Calculator Logic ---
    const fireForm = document.getElementById('fire-form');
    const resultArea = document.getElementById('result-area');

    const assetA = document.getElementById('asset-a');
    const rateB = document.getElementById('rate-b');
    const assetC = document.getElementById('asset-c');
    const rateD = document.getElementById('rate-d');
    const expenseE = document.getElementById('expense-e');
    const inflationF = document.getElementById('inflation-f');

    // --- Dividend Income Auto-calculation ---
    const dividendHint = document.getElementById('dividend-income-hint');
    const updateDividendIncome = () => {
        const valA = parseFloat(removeCommas(assetA.value)) || 0;
        const valB = parseFloat(rateB.value) || 0;
        const income = (valA * valB) / 100;
        if (dividendHint) {
            dividendHint.textContent = `配息年收入：${income.toLocaleString()} 萬元`;
        }
    };

    if (assetA && rateB) {
        assetA.addEventListener('input', updateDividendIncome);
        rateB.addEventListener('input', updateDividendIncome);
    }

    // Numbers with thousand separator (keeping decimals)
    const formatNumber = (val) => {
        if (!val) return '';
        const parts = val.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join('.');
    };

    const removeCommas = (val) => val.toString().replace(/,/g, '');

    // Input monitoring for assets and expense
    [assetA, assetC, expenseE].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                const caretPos = e.target.selectionStart;
                const prevLen = e.target.value.length;

                // Allow digits, one dot, and no commas in raw value
                let rawValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '');

                // Ensure only one decimal point
                const dotIndex = rawValue.indexOf('.');
                if (dotIndex !== -1) {
                    rawValue = rawValue.slice(0, dotIndex + 1) + rawValue.slice(dotIndex + 1).replace(/\./g, '');
                }

                const formatted = formatNumber(rawValue);
                e.target.value = formatted;

                // Adjust cursor
                const newLen = e.target.value.length;
                e.target.setSelectionRange(caretPos + (newLen - prevLen), caretPos + (newLen - prevLen));
            });
        }
    });

    if (fireForm) {
        fireForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Convert "Ten Thousand Yuan" to "Yuan"
            const a2 = (parseFloat(removeCommas(assetA.value)) || 0) * 10000;
            const b2 = (parseFloat(rateB.value) || 0) / 100;
            const c2 = (parseFloat(removeCommas(assetC.value)) || 0) * 10000;
            const d2 = (parseFloat(rateD.value) || 0) / 100;
            const e2 = (parseFloat(removeCommas(expenseE.value)) || 0) * 10000;
            const f2 = (parseFloat(inflationF.value) || 0) / 100;

            // Calculation Logic
            // C' = A2 * (B2 - F2)
            const cPrime = a2 * (b2 - f2);
            // I2 = C2 * (D2 - F2) + C'
            const i2 = c2 * (d2 - f2) + cPrime;
            // J2 = I2 - E2
            const j2 = i2 - e2;

            renderResults(j2, b2, f2, d2, a2, c2);
        });
    }

    function renderResults(j2, b2, f2, d2, a2, c2) {
        resultArea.classList.remove('hidden');

        const isSuccess = j2 > 0;
        const successCheers = [
            "你已成功建立足以支撐理想生活的系統，現在，時間是屬於你自己的了！",
            "財務自由不是終點，而是擁有選擇權的起點。享受這份得來不易的自由吧！"
        ];
        const warningCheers = [
            "每一份累積都是通往自由的磚塊，你正走在正確的道路上！",
            "專注於資產的增長與複利的力量，未來的你一定會感謝現在努力的自己。"
        ];
        const cheer = isSuccess ? successCheers[Math.floor(Math.random() * successCheers.length)] :
            warningCheers[Math.floor(Math.random() * warningCheers.length)];

        let htmlContent = '';
        if (isSuccess) {
            htmlContent = `
                <div class="result-card success">
                    <div class="result-header">
                        <i data-lucide="check-circle"></i>
                        <h3>✅ 恭喜！您已實現財務自由</h3>
                    </div>
                    <p class="cheer-text">「${cheer}」</p>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">每月實質超額現金流</span>
                            <span class="stat-value">$${Math.round(j2 / 12).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const gap = Math.abs(j2);
            const diffB = b2 - f2;
            const diffD = d2 - f2;

            const gapA = diffB > 0 ? gap / diffB : Infinity;
            const gapC = diffD > 0 ? gap / diffD : Infinity;

            const targetTotalA = Math.round((gapA + a2) / 10000).toLocaleString();
            const targetTotalC = Math.round((gapC + c2) / 10000).toLocaleString();

            htmlContent = `
                <div class="result-card warning">
                    <div class="result-header">
                        <i data-lucide="info"></i>
                        <h3>❌ 距離目標還差一點，繼續前進！</h3>
                    </div>
                    <p class="cheer-text">「${cheer}」</p>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">年度資金缺口</span>
                            <span class="stat-value">$${Math.round(gap).toLocaleString()}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">方案 1：需補足配息型資產</span>
                            <span class="stat-value">$${gapA === Infinity ? '無法計算 (利率過低)' : Math.round(gapA).toLocaleString()}</span>
                            ${gapA !== Infinity ? `<small style="color: var(--text-secondary); display: block; margin-top: 5px;">目標總額：${targetTotalA} 萬元</small>` : ''}
                        </div>
                        <div class="stat-divider" style="text-align: center; color: var(--text-secondary); font-size: 0.9rem; margin: 10px 0;">— 或者 —</div>
                        <div class="stat-item">
                            <span class="stat-label">方案 2：需補足成長型資產</span>
                            <span class="stat-value">$${gapC === Infinity ? '無法計算 (報酬過低)' : Math.round(gapC).toLocaleString()}</span>
                            ${gapC !== Infinity ? `<small style="color: var(--text-secondary); display: block; margin-top: 5px;">目標總額：${targetTotalC} 萬元</small>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        resultArea.innerHTML = htmlContent;
        lucide.createIcons();
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Back to top behavior
    document.querySelectorAll('.back-to-top').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});
