import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

function loadBank(app) {
  const context = vm.createContext({ window: {} });
  vm.runInContext(readFileSync(new URL(`../${app}/data/bank.js`, import.meta.url), 'utf8'), context);
  return context.window.APP_BANK;
}

test('question text does not contain known imported page headers or source-code debris', () => {
  const contamination = /第一科：人工智慧基礎概論|第二科：生成式 AI 應用與規劃|114 年第四次AI 應用規劃師-初級能力鑑定【公告試題】|答案題目|《以下空白》|";}$/;
  for (const app of ['junior', 'intermediate', 'bi', 'aiot']) {
    for (const question of loadBank(app)) {
      for (const [field, text] of Object.entries({ stem: question.stem, ...question.options })) {
        assert.doesNotMatch(text, contamination, `${app}: ${question.id} ${field}`);
      }
    }
  }
});

test('source-verified Python questions retain code lines and separate explanatory text', () => {
  const questions = new Map(loadBank('intermediate').map(question => [question.id, question]));
  const blocks = {
    'web-s2-1148': ["data['Year']", '# 0     2006.0', '# 1     1985.0', '# ...', '# Name: Year, Length: 16598, dtype: float64'],
    'web-s3-1159': ['X_train -= X_train.mean(axis=0)', 'X_train /= X_train.std(axis=0)', 'X_test -= X_test.mean(axis=0)', 'X_test /= X_test.std(axis=0)'],
    'web-s3-1160': ['model = Sequential()', 'model.add(Input(shape=(X_train.shape[1],)))', 'model.add(Dense(10, activation="relu"))', 'model.add(Dense(10, activation="relu"))', 'model.add(Dense(1, activation="sigmoid"))'],
    'web-s3-187': ['history = model.fit(X_train, y_train, validation_split=0.2, epochs=100, batch_size=10)', 'loss, accuracy = model.evaluate(X_train, y_train, verbose=0)', '', 'import matplotlib.pyplot as plt', 'loss = history.history["loss"]', 'epochs = range(1, len(loss)+1)', 'val_loss = history.history["val_loss"]', 'plt.plot(epochs, loss, 空格1, label="Training Loss")', 'plt.plot(epochs, val_loss, 空格2, label="Validation Loss")', 'plt.title("Training and Validation Loss")', 'plt.xlabel("Epochs")', 'plt.ylabel("Loss")', 'plt.legend()', 'plt.show()'],
    'web-s2-770': ['class C1:', '    a = 10', 'class C2(C1):', '    a = 20', 'c2 = C2()'],
    'web-s2-782': ['class c1:', '    def __init__(self):', '        self.i = 0', '    def add(self):', '        self.i += 2', 'c = c1()', 'c.add()', 'print(c.i)'],
  };
  for (const [id, lines] of Object.entries(blocks)) {
    assert.ok(questions.get(id).stem.includes(`\n\n\`\`\`python\n${lines.join('\n')}\n\`\`\`\n\n`), id);
  }
});

// 網路題庫匯入時曾把換行吃掉：程式碼擠成一行、子敘述 A～F 或 (1)～(n) 接在同一行，難以閱讀。
test('statement lists and code in question stems stay on separate lines', () => {
  const files = { junior: ['content', 'bank'], intermediate: ['content', 'bank'], bi: ['content', 'bank'], aiot: ['content', 'bank', 'official-guide', 'legacy-bank'] };
  const marker = /(?:^|[\s。；，？?])(?:原因\s?|程式碼\s?|事件\s?|描述\s?|敘述\s?)?[A-F](?:[：:]|\.\s)/g;
  const numbered = /[（(][1-9][)）]/g;
  const assignedCall = /\b\w+\s*=\s*[\w.]+\(/g;
  const lostNewline = /(?:^|[\s：:])n(?:class |def |print\()/;
  for (const [app, names] of Object.entries(files)) {
    const context = vm.createContext({ window: {} });
    for (const name of names) vm.runInContext(readFileSync(new URL(`../${app}/data/${name}.js`, import.meta.url), 'utf8'), context);
    const questions = [...(context.window.APP_CONTENT?.questions || []), ...(context.window.APP_BANK || []),
      ...(context.window.APP_OFFICIAL_GUIDE || []), ...(context.window.APP_LEGACY_BANK || [])];
    for (const question of questions) {
      let inFence = false;
      for (const line of question.stem.split('\n')) {
        if (/^```/.test(line)) { inFence = !inFence; continue; }
        if (inFence) continue;
        const label = `${app}: ${question.id} ${line.slice(0, 40)}`;
        assert.ok((line.match(marker) || []).length < 2, label);
        assert.ok((line.match(numbered) || []).length < 3, label);
        assert.ok((line.match(assignedCall) || []).length < 3, label);
        assert.doesNotMatch(line, lostNewline, label);
      }
    }
  }
  const loss = loadBank('intermediate').find(question => question.id === 'web-s3-187');
  assert.equal(loss.topic, 's3-c8', 'loss-curve question belongs to model evaluation, not governance');
  assert.match(loss.stem, /\nA：空格 1 須填入 "b-"\nB：/);
});

test('unverifiable Python source questions remain accessible by ID but leave normal practice pools', () => {
  const context = vm.createContext({ window: {} });
  for (const file of ['data/content.js', 'data/bank.js', 'assets/js/content-api.js']) {
    vm.runInContext(readFileSync(new URL(`../intermediate/${file}`, import.meta.url), 'utf8'), context);
  }
  const content = context.window.Content;
  for (const id of ['web-s2-770', 'web-s2-782']) {
    assert.equal(content.question(id).needsContext, true, id);
    assert.equal(content.questions().some(question => question.id === id), false, id);
    assert.equal(content.allOfficial(false).some(question => question.id === id), false, id);
    assert.equal(content.questions({ ids: [id] }).length, 1, 'existing saved history still resolves');
  }
});
