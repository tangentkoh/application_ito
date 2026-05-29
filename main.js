'use strict';

const card      = document.getElementById('card');
const numberEl  = document.getElementById('number');
const drawBtn   = document.getElementById('draw-btn');
const blindBtn  = document.getElementById('blind-btn');
const memoArea  = document.getElementById('memo-area');
const memoDisp  = document.getElementById('memo-display');
const memoInput = document.getElementById('memo-input');

// ===== State =====
let currentNumber = null;
let isBlind       = false;
let canRedraw     = false;
// Rules:
//   - 初回抽選は常に可能
//   - 抽選後はブラインド→解除のサイクルを経ないと再抽選不可
//   - ブラインド中は再抽選不可

// ===== UI Update =====
function updateUI() {
    numberEl.textContent = currentNumber !== null ? currentNumber : '?';
    card.classList.toggle('is-blind', isBlind);

    const drawEnabled = currentNumber === null || (!isBlind && canRedraw);
    drawBtn.disabled  = !drawEnabled;

    blindBtn.disabled   = currentNumber === null;
    blindBtn.textContent = isBlind ? '解除' : 'ブラインド';
}

// ===== Actions =====
function draw() {
    currentNumber = Math.floor(Math.random() * 100) + 1;
    isBlind   = false;
    canRedraw = false;

    numberEl.classList.remove('pop');
    void numberEl.offsetWidth; // reflow to restart animation
    numberEl.classList.add('pop');

    updateUI();
}

function toggleBlind() {
    if (isBlind) {
        isBlind   = false;
        canRedraw = true;
    } else {
        isBlind = true;
    }
    updateUI();
}

drawBtn.addEventListener('click', draw);
blindBtn.addEventListener('click', toggleBlind);

// ===== Memo area =====
memoDisp.addEventListener('click', () => {
    memoArea.classList.add('is-editing');
    memoInput.focus();
    memoInput.setSelectionRange(memoInput.value.length, memoInput.value.length);
});

function closeMemo() {
    memoArea.classList.remove('is-editing');
    const val = memoInput.value;
    if (val.trim()) {
        memoDisp.textContent = val;
        memoDisp.classList.remove('is-placeholder');
    } else {
        memoDisp.textContent = 'タップして入力...';
        memoDisp.classList.add('is-placeholder');
    }
}

memoInput.addEventListener('blur', closeMemo);

memoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') memoInput.blur();
});

memoInput.addEventListener('input', () => {
    memoInput.style.height = 'auto';
    memoInput.style.height = Math.max(88, memoInput.scrollHeight) + 'px';
});

// ===== Init =====
updateUI();
