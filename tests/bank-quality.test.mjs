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
  for (const app of ['junior', 'intermediate', 'bi']) {
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
  };
  for (const [id, lines] of Object.entries(blocks)) {
    assert.ok(questions.get(id).stem.includes(`\n\n\`\`\`python\n${lines.join('\n')}\n\`\`\`\n\n`), id);
  }
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
