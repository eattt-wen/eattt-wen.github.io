'use strict';
(() => {
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const project='cefm';let step=0;const pick=pair=>pair[window.siteLang==='zh'?1:0];
  const research = {
    cefm: {
      meta: ['CEFM · AAAI 2026 · ORAL', 'CEFM · AAAI 2026 · 口头报告'],
      title: ['What makes a diagnosis explainable?', '如何让诊断有据可循？'],
      description: ['Aligning dermoscopic representations with quantitative clinical features, then translating them into structured diagnostic reports.', '将皮肤镜图像表征与量化临床特征对齐，再转化为结构化诊断报告。'],
      tags: [['Contrastive learning', '对比学习'], ['Clinical priors', '临床先验'], ['LLM reports', '大模型报告']],
      role: ['Lead researcher · Mar.–Oct. 2025', '主导研究 · 2025 年 3–10 月'],
      links: [ ['https://eattt-wen.github.io/CEFM/', ['Project page ↗', '论文主页 ↗']], ['https://arxiv.org/abs/2512.06105', ['arXiv ↗', 'arXiv ↗']], ['https://arxiv.org/pdf/2512.06105', ['PDF ↓', 'PDF ↓']], ['https://github.com/eattt-wen/CEFM', ['GitHub ↗', '代码仓库 ↗']] ],
      steps: [
        {tab:['01 Extract','01 提取'],symbol:'ABC',title:['Quantify clinical features','量化临床特征'],body:['A coarse-to-fine segmentation pipeline uses UltraLight VM-UNet and SAM2 to quantify lesion asymmetry, border irregularity, and color variation.','利用 UltraLight VM-UNet 与 SAM2 构建由粗到细的分割流程，量化病灶的不对称性、边界不规则性和颜色变化。']},
        {tab:['02 Align','02 对齐'],symbol:'Image ↔ ABC',title:['Align vision with clinical priors','对齐视觉表征与临床先验'],body:['Dual projection heads and bidirectional contrastive learning align ViT-based dermoscopic representations with quantitative ABC descriptors, bringing clinical criteria into the representation space.','通过双投影头与双向对比学习，将基于 ViT 的皮肤镜表征与量化 ABC 描述符对齐，使临床标准进入表征空间。']},
        {tab:['03 Explain','03 解释'],symbol:'Features → Report',title:['Generate structured diagnostic reports','生成结构化诊断报告'],body:['CLIP-based dermatological concept retrieval and a domain-adapted DeepSeek LLM combine quantitative ABC findings, visual attributes, and melanoma risk assessment in a structured report.','结合基于 CLIP 的皮肤科概念检索与领域适配的 DeepSeek 模型，将量化 ABC 特征、视觉属性和黑色素瘤风险评估整合为结构化报告。']}
      ]
    },

  };
  function renderMethod() {
    const method = research[project].steps[step];
    $$('#method-tabs button').forEach((button, index) => {
      button.setAttribute('aria-selected', String(index === step));
      button.tabIndex = index === step ? 0 : -1;
    });
    const panel = $('#method-detail');
    panel.setAttribute('aria-labelledby', `method-tab-${step}`);
    panel.replaceChildren();
    const symbol = document.createElement('span'); symbol.className = 'method-symbol'; symbol.setAttribute('aria-hidden', 'true'); symbol.textContent = method.symbol;
    const title = document.createElement('h4'); title.textContent = pick(method.title);
    const body = document.createElement('p'); body.textContent = pick(method.body);
    panel.append(symbol, title, body);
    $('#step-count').textContent = `0${step + 1} / 03`;
  }
  function renderProject() {
    const data = research[project];
    for (const field of ['meta','title','description','role']) $(`#project-${field}`).textContent = pick(data[field]);
    $('#project-tags').replaceChildren(...data.tags.map(tag => {const span = document.createElement('span'); span.textContent = pick(tag); return span;}));
    $('#project-links').replaceChildren(...data.links.map(([url,label]) => {const a = document.createElement('a'); a.href = url; a.textContent = pick(label); if (url.startsWith('https:')) {a.target='_blank'; a.rel='noopener';} return a;}));
    $('#method-tabs').replaceChildren(...data.steps.map((method,index) => {
      const button = document.createElement('button'); button.textContent = pick(method.tab); button.id = `method-tab-${index}`; button.setAttribute('role','tab'); button.setAttribute('aria-controls','method-detail');
      button.addEventListener('click', () => {step = index; renderMethod();}); return button;
    }));
    renderMethod();
  }
  function keyboardTabs(container) {
    container.addEventListener('keydown',event => {
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      const buttons = [...container.querySelectorAll('[role=tab]')];
      const current = buttons.indexOf(document.activeElement); if(current < 0) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus(); buttons[next].click();
    });
  }
  keyboardTabs($('#method-tabs'));
  $('#next-step').addEventListener('click',() => {step = (step + 1) % 3; renderMethod(); $(`#method-tab-${step}`).focus();});

document.addEventListener('languagechange',renderProject);renderProject();
})();