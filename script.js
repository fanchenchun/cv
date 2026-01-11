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

    // Secondary metrics elements
    const valCPrime = document.getElementById('val-c-prime');
    const valGrowthIncome = document.getElementById('val-growth-income');
    const valI2 = document.getElementById('val-i2');

    // Numbers with thousand separator (keeping decimals)
    const formatNumber = (val) => {
        if (val === undefined || val === null || isNaN(val)) return '0';
        const parts = val.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join('.');
    };

    const removeCommas = (val) => val.toString().replace(/,/g, '');

    const calculateFIRE = () => {
        // Raw values in "Ten Thousand Yuan"
        const aVal = parseFloat(removeCommas(assetA.value)) || 0;
        const bVal = (parseFloat(rateB.value) || 0) / 100;
        const cVal = parseFloat(removeCommas(assetC.value)) || 0;
        const dVal = (parseFloat(rateD.value) || 0) / 100;
        const eVal = parseFloat(removeCommas(expenseE.value)) || 0;
        const fVal = (parseFloat(inflationF.value) || 0) / 100;

        // Internal calculation in "Yuan"
        const a2 = aVal * 10000;
        const b2 = bVal;
        const c2 = cVal * 10000;
        const d2 = dVal;
        const e2 = eVal * 10000;
        const f2 = fVal;

        // Calculation Logic
        // C' = A2 * (B2 - F2)
        const cPrime = a2 * (b2 - f2);
        // Real Growth Income = C2 * (D2 - F2)
        const growthIncome = c2 * (d2 - f2);
        // I2 = Growth Income + C'
        const i2 = growthIncome + cPrime;
        // J2 = I2 - E2
        const j2 = i2 - e2;

        // Update Secondary Metrics (Display in "Ten Thousand Yuan" with formatting)
        if (valCPrime) valCPrime.textContent = `${formatNumber((cPrime / 10000).toFixed(2))} 萬元`;
        if (valGrowthIncome) valGrowthIncome.textContent = `${formatNumber((growthIncome / 10000).toFixed(2))} 萬元`;
        if (valI2) valI2.textContent = `${formatNumber((i2 / 10000).toFixed(2))} 萬元`;

        return { j2, b2, f2, d2, a2, c2 };
    };

    const updateAll = () => {
        const results = calculateFIRE();
        // If results hidden, don't auto-show until first submit or if user is interacting
        // But the requirement says "immediately reflect", so we show if result area is already visible
        if (!resultArea.classList.contains('hidden')) {
            renderResults(results.j2, results.b2, results.f2, results.d2, results.a2, results.resultsC2);
        }
    };

    // Input monitoring for assets and expense (Thousands separator)
    [assetA, assetC, expenseE].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                const caretPos = e.target.selectionStart;
                const prevLen = e.target.value.length;

                let rawValue = removeCommas(e.target.value).replace(/[^0-9.]/g, '');
                const dotIndex = rawValue.indexOf('.');
                if (dotIndex !== -1) {
                    rawValue = rawValue.slice(0, dotIndex + 1) + rawValue.slice(dotIndex + 1).replace(/\./g, '');
                }

                const formatted = formatNumber(rawValue);
                e.target.value = formatted;

                const newLen = e.target.value.length;
                e.target.setSelectionRange(caretPos + (newLen - prevLen), caretPos + (newLen - prevLen));

                calculateFIRE(); // Update secondary metrics immediately
                if (!resultArea.classList.contains('hidden')) {
                    const r = calculateFIRE();
                    renderResults(r.j2, r.b2, r.f2, r.d2, r.a2, r.c2);
                }
            });
        }
    });

    // Monitoring for rate inputs
    [rateB, rateD, inflationF].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                calculateFIRE();
                if (!resultArea.classList.contains('hidden')) {
                    const r = calculateFIRE();
                    renderResults(r.j2, r.b2, r.f2, r.d2, r.a2, r.c2);
                }
            });
        }
    });

    if (fireForm) {
        fireForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const r = calculateFIRE();
            renderResults(r.j2, r.b2, r.f2, r.d2, r.a2, r.c2);
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
        const cheerArray = isSuccess ? successCheers : warningCheers;
        const cheer = cheerArray[Math.floor(Math.random() * cheerArray.length)];

        let htmlContent = '';
        if (isSuccess) {
            htmlContent = `
                <div class="result-card success">
                    <div class="result-header">
                        <i data-lucide="check-circle" style="color: #48bb78;"></i>
                        <h3 style="color: #2f855a;">✅ 恭喜！您已實現財務自由</h3>
                    </div>
                    <p class="cheer-text" style="color: #2f855a; font-weight: 500; margin: 15px 0;">「${cheer}」</p>
                    <div class="stats-grid">
                        <div class="stat-item" style="background: white; padding: 15px; border-radius: 8px; box-shadow: var(--shadow-sm);">
                            <span class="stat-label" style="font-size: 0.9rem; color: var(--text-secondary); display: block;">每月實質超額現金流</span>
                            <span class="stat-value" style="font-size: 1.5rem; font-weight: 700; color: #48bb78;">+$${formatNumber(Math.round(j2 / 12))}</span>
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
                        <i data-lucide="info" style="color: #f56565;"></i>
                        <h3 style="color: #c53030;">❌ 距離目標還差一點，繼續前進！</h3>
                    </div>
                    <p class="cheer-text" style="color: #c53030; font-weight: 500; margin: 15px 0;">「${cheer}」</p>
                    <div class="stats-grid">
                        <div class="stat-item" style="background: white; padding: 15px; border-radius: 8px; box-shadow: var(--shadow-sm); margin-bottom: 15px;">
                            <span class="stat-label" style="font-size: 0.9rem; color: var(--text-secondary); display: block;">年度資金缺口</span>
                            <span class="stat-value" style="font-size: 1.5rem; font-weight: 700; color: #f56565;">-$${formatNumber(Math.round(gap))}</span>
                        </div>
                        <div class="stat-item" style="background: white; padding: 15px; border-radius: 8px; box-shadow: var(--shadow-sm);">
                            <span class="stat-label" style="font-size: 0.9rem; color: var(--text-secondary);">方案 1：需補足配息型資產</span>
                            <span class="stat-value" style="font-size: 1.25rem; font-weight: 600; display: block; margin-top: 5px;">$${gapA === Infinity ? '無法計算 (利率過低)' : formatNumber(Math.round(gapA))}</span>
                            ${gapA !== Infinity ? `<small style="color: var(--text-secondary); display: block; margin-top: 5px;">目標總額：${targetTotalA} 萬元</small>` : ''}
                        </div>
                        <div class="stat-divider" style="text-align: center; color: var(--text-secondary); font-size: 0.9rem; margin: 15px 0; font-style: italic;">— 或者 —</div>
                        <div class="stat-item" style="background: white; padding: 15px; border-radius: 8px; box-shadow: var(--shadow-sm);">
                            <span class="stat-label" style="font-size: 0.9rem; color: var(--text-secondary);">方案 2：需補足成長型資產</span>
                            <span class="stat-value" style="font-size: 1.25rem; font-weight: 600; display: block; margin-top: 5px;">$${gapC === Infinity ? '無法計算 (報酬過低)' : formatNumber(Math.round(gapC))}</span>
                            ${gapC !== Infinity ? `<small style="color: var(--text-secondary); display: block; margin-top: 5px;">目標總額：${targetTotalC} 萬元</small>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }

        resultArea.innerHTML = htmlContent;
        lucide.createIcons();
        if (typeof event !== 'undefined' && event && event.type === 'submit') {
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Back to top behavior
    document.querySelectorAll('.back-to-top').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});
