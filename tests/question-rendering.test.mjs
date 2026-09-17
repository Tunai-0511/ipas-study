import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

function createQuiz(app, question) {
  const buttons = new Map();
  const events = new Map();
  const options = ['A', 'B', 'C', 'D'].map((letter) => ({ getAttribute: () => letter }));
  const mount = {
    innerHTML: '',
    querySelector(selector) {
      if (!buttons.has(selector)) buttons.set(selector, {});
      return buttons.get(selector);
    },
    querySelectorAll: (selector) => selector === '.option' ? options : [],
  };
  const context = vm.createContext({
    setInterval: () => 1, clearInterval() {},
    document: {
      addEventListener: (name, callback) => events.set(name, callback),
      removeEventListener: name => events.delete(name),
    },
    Icon: { get: () => '' },
    Content: { subjectName: () => '測試科目', chapterTitle: () => '測試章節' },
    Store: { isBookmarked: () => false, getExplain: () => '', addAttempt() {} },
    Charts: { ring: () => '', bars: () => '' },
  });
  context.window = context;
  vm.runInContext(readFileSync(new URL(`../${app}/assets/js/quiz.js`, import.meta.url), 'utf8'), context);
  context.Quiz.launch({ mode: 'official', questions: [question] }, mount);
  return { mount, options, key: event => events.get('keydown')(event) };
}

function renderQuestion(app, question) {
  const { mount, options } = createQuiz(app, question);
  const quiz = mount.innerHTML;
  options[0].onclick();
  const answered = mount.innerHTML;
  mount.querySelector('#qzNext').onclick();
  return { quiz, answered, review: mount.innerHTML };
}

const baseQuestion = {
  id: 'render-fixture', subject: 'S1', subjectName: '人工智慧技術應用',
  source: '官方公告試題 115-1', number: 40,
  stem: '第一行\n第二行 <script>不可執行</script>',
  options: { A: '程式第一行\n程式第二行', B: '正確答案', C: '其他', D: '其他' },
  answer: 'B', explanation: '第一段解析\n\n第二段解析',
};

for (const app of ['junior', 'intermediate', 'bi']) {
  test(`${app}: Enter keeps links and buttons native while quiz shortcuts still work`, () => {
    const h = createQuiz(app, baseQuestion);
    const initial = h.mount.innerHTML;
    for (const tagName of ['A', 'BUTTON']) {
      let prevented = false;
      h.key({
        key: 'Enter', target: { tagName, closest: selector => selector === 'a, button' ? {} : null },
        preventDefault: () => { prevented = true; },
      });
      assert.equal(prevented, false, `${tagName}: native Enter was intercepted`);
      assert.equal(h.mount.innerHTML, initial, `${tagName}: Enter incorrectly advanced the quiz`);
    }
    const target = { tagName: 'DIV', closest: () => null };
    let prevented = false;
    h.key({ key: '1', target, preventDefault: () => { prevented = true; } });
    assert.equal(prevented, true);
    assert.match(h.mount.innerHTML, /option wrong/);
    h.key({ key: 'Enter', target, preventDefault() {} });
    assert.match(h.mount.innerHTML, /逐題檢討/);
  });

  test(`${app}: quiz and review preserve shared context and ordered, unique local figures`, () => {
    const result = renderQuestion(app, {
      ...baseQuestion, context: '共同題幹第一段\n\n第二段 <img src=x onerror=alert(1)>',
      image: 'assets/media/figs/code.png',
      images: ['assets/media/figs/code.png', 'assets/media/figs/chart.png', 'assets/media/figs/code.png'],
    });
    for (const html of [result.quiz, result.answered, result.review]) {
      assert.match(html, /共同題幹第一段\n\n第二段 &lt;img src=x onerror=alert\(1\)&gt;/);
      assert.match(html, /第一行\n第二行 &lt;script&gt;不可執行&lt;\/script&gt;/);
      assert.equal((html.match(/<figure class="q-fig">/g) || []).length, 2);
      assert.equal((html.match(/<img src="assets\/media\/figs\/code.png"/g) || []).length, 1);
      assert.ok(html.indexOf('figs/code.png') < html.indexOf('figs/chart.png'));
      assert.match(html, /href="assets\/media\/figs\/code.png" target="_blank" rel="noopener noreferrer"/);
      assert.match(html, /alt="[^"]*第 40 題[^"]*附圖 1"/);
      assert.match(html, /點擊查看原圖/);
      assert.doesNotMatch(html, /<script>|<img src=x/);
    }
    for (const html of [result.answered, result.review]) {
      assert.match(html, /第一段解析\n\n第二段解析/);
    }
  });

  test(`${app}: figure links reject external, active, and traversal URLs`, () => {
    const result = renderQuestion(app, {
      ...baseQuestion,
      images: [
        'javascript:alert(1)', 'https://example.test/image.png', '//example.test/image.png',
        '/assets/media/image.png', 'assets/../image.png', 'assets/media/%2e%2e/image.png',
        'assets/media/image.svg', 'assets/media/image.png?redirect=evil',
        'assets/media/image.png#fragment', 'assets/media/image" onerror="alert(1).png',
      ],
      image: 'data:image/png;base64,invalid',
    });
    for (const html of [result.quiz, result.review]) {
      assert.doesNotMatch(html, /<figure|<img|class="q-context"/);
    }
  });

  test(`${app}: legacy image remains visible without requiring new fields`, () => {
    const result = renderQuestion(app, { ...baseQuestion, image: 'assets/media/figs/original.png' });
    for (const html of [result.quiz, result.review]) {
      assert.equal((html.match(/<img src="assets\/media\/figs\/original.png"/g) || []).length, 1);
    }
  });

  test(`${app}: supported code fences render safely across quiz, options, context, and review`, () => {
    const fenced = '說明\n```python\nfor item in values:\n    print("<script>alert(1)</script>")\n```\n結尾';
    const bareFence = '```\nfirst_line\n    second_line\n```';
    const result = renderQuestion(app, {
      ...baseQuestion, context: fenced, stem: fenced, explanation: fenced,
      options: { A: fenced, B: bareFence, C: '一般選項', D: '一般選項' },
    });
    for (const html of [result.quiz, result.answered, result.review]) {
      assert.match(html, /<code class="q-code">for item in values:\n    print\(&quot;&lt;script&gt;alert\(1\)&lt;\/script&gt;&quot;\)<\/code>/);
      assert.match(html, /<code class="q-code">first_line\n    second_line<\/code>/);
      assert.doesNotMatch(html, /```|<script>/);
    }
    assert.equal((result.quiz.match(/class="q-code"/g) || []).length, 4);
    assert.equal((result.answered.match(/class="q-code"/g) || []).length, 5);
    assert.equal((result.review.match(/class="q-code"/g) || []).length, 5);
  });

  test(`${app}: unknown and unpaired fences stay escaped literal text`, () => {
    const literal = '```html\n<img src=x onerror=alert(1)>\n```\n一般文字\n```python\nprint("unfinished")';
    const result = renderQuestion(app, { ...baseQuestion, stem: literal });
    for (const html of [result.quiz, result.review]) {
      assert.match(html, /```html\n&lt;img src=x onerror=alert\(1\)&gt;\n```\n一般文字\n```python\nprint\(&quot;unfinished&quot;\)/);
      assert.doesNotMatch(html, /class="q-code"|<img/);
    }
  });
}
