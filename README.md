## URL

```
アンケート一覧の取得: GET: /question
アンケートの削除: DELETE: /question/{id}
投票: POST: /question/{question_id}/choice/{choice_id}/vote

ユーザー登録: POST: /signup
ログイン: POST: /signin
```

## データ設計

```
questions
    id: number
    question: string
    limit: date
    created_by: number
    created_at: date
    updated_at: date

choices
    id: number
    question_id: number
    content: string
    created_at: date
    updated_at: date

votes
    id: number
    question_id: number
    choice_id: number
    voted_by: number
    created_at: number
    updated_at: date

users
    id: number
    name: string
    password: string
    created_at: date
    updated_at: date
```

---

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

## Sequelize の導入

Manual | Sequelize
https://sequelize.org/v5/

DBを準備する手間を省略するため、データは `sqlite` に格納

```
> npm install --save cors body-parser
> npm install --save-dev @types/cors @types/body-parser
> npm install --save sqlite3 sequelize
> npm install --save-dev @types/sequelize @types/validator @types/bluebird ts-node
> mkdir database
> mkdir src/{models,routes,controllers}
> touch src/models/{index.ts,db.ts,Question.ts,Choice.ts,Vote.ts,User.ts}
> touch src/routes/{index.ts,question.ts,auth.ts}
> touch src/controllers/{index.ts,QuestionController.ts,LoginController.ts}
```

### dotenv

```
> npm install --save dotenv
> npm install --save-dev @types/dotenv
```

### bcrypt

```
> npm install --save bcrypt
> npm install --save-dev @types/bcrypt
> npm install --save jsonwebtoken
> npm install --save-dev @types/jsonwebtoken
```

## test

```
> npm install --save-dev jest ts-jest supertest @types/jest @types/supertest
> mkdir test
> touch test/{auth,question}.test.ts
> npx ts-jest config:init
```

## log (morgan)

```
> npm install --save morgan
> npm install --save-dev @types/morgan
```

---

TypeScript で Express サーバを実装するためのボイラープレートを作った - Corredor
https://neos21.hatenablog.com/entry/2020/06/13/080000

esModuleInterop オプションの必要性について - Qiita
https://qiita.com/karak/items/29ff148788f5abb15331

Express 4.x - API Reference
http://expressjs.com/en/4x/api.html


Node+TypeScript+ExpressでAPIサーバ構築 - Qiita
https://qiita.com/pochopocho13/items/79a4735031ce11a91df7

Manual | Sequelize
https://sequelize.org/v5/manual/typescript.html


typescript-express-sequelize/src at master · maximegris/typescript-express-sequelize
https://github.com/maximegris/typescript-express-sequelize/tree/master/src

Expressの冗長なエラー処理を簡潔にする - Qiita
https://qiita.com/azujuuuuuun/items/f0be4a71aca2d92036aa

sequelize v5とtypescript - Qiita
https://qiita.com/pokotyan/items/776613d869eca99f6b7b

Express error handling
http://expressjs.com/en/guide/error-handling.html

サルでも分かるExpressでのjsonAPIサーバーの作り方 - Qiita
https://qiita.com/ngmr_mo/items/73cc7160d002a4989416#%E5%BF%85%E8%A6%81%E3%81%AA%E3%83%A9%E3%82%A4%E3%83%96%E3%83%A9%E3%83%AA%E3%81%AA%E3%81%A9%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%AB

Node.js + Express + TypeScriptでWebAPIを作る（4/4） - Qiita
https://qiita.com/s-yoshida/items/5ac5da205ea502f1a169

JSON Web Token (JWT) - Node.js/TypeScript 関連 - Node.js 入門
https://nodejs.keicode.com/nodejs/jwt.php

Express で JWT を用いた認証を実装する方法 - Express - Node.js 入門
https://nodejs.keicode.com/nodejs/express-jwtauth.php

Bcryptを用いてパスワードをハッシュ化する (Node.js) - kkty’s blog
https://blog.kkty.jp/entry/2019/04/13/082214

JSON Web Token Introduction - jwt.io
https://jwt.io/introduction/

Jest · 🃏快適なJavaScriptのテスト
https://jestjs.io/ja/

visionmedia/supertest: 🕷Super-agent driven library for testing node.js HTTP servers using a fluent API.
https://github.com/visionmedia/supertest

Supertest authenticate with bearer token
https://gist.github.com/bq1990/595c615970250e97f3ea
