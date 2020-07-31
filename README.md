
```sh
> mkdir express-vote
> cd express-vote
> npm init -y
> npm install --save-dev typescript @types/node
> npx tsc --init
> npm install --save express
> npm install --save-dev @types/express
> npm install --save-dev ts-node-dev
> npm install --save-dev eslint
> npx eslint --init
> npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
> touch .prettierrc.js
> touch .editorconfig
> mkdir .vscode
> touch .vscode/settings.json
> mkdir src
> touch src/app.ts
```

1. `.eslintrc.js` を修正
2. `.prettierrc.js` を作成、設定追加
3. `.editorconfig` を作成、設定追加
4. `.vscode/settings.json` を作成、設定追加
5. `package.json` を修正
    - `npm run dev`
    - `npm run build`
    - `npm start`


```ts:app.ts
import express from 'express';

const app = express();
app.get('/', (_, res) => res.send('hello'));

app.listen(process.env.PORT || 3080, () => {
    // eslint-disable-next-line no-console
    console.log('listening');
});

```

```sh
> npm run dev
# 別のターミナルを起動
> curl http://localhost:3080
hello%
```

応答が返ってくることを確認

つづいて build の確認

```sh
> npm run build
# ./dist/app.js が生成される
> npm start
# 別のターミナルを起動
> curl http://localhost:3080
hello%
```

応答が返ってくることを確認
開発環境は整った

---


---

TypeScript で Express サーバを実装するためのボイラープレートを作った - Corredor
https://neos21.hatenablog.com/entry/2020/06/13/080000

esModuleInterop オプションの必要性について - Qiita
https://qiita.com/karak/items/29ff148788f5abb15331
