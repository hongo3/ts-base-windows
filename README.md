# (2021/09) Windows10 + node.js + TypeScript + nodemon 環境の構築

## 概要
TypeScriptでソース更新後、自動コンパイル＆実行の構築をしてみる。
Windows で TypeScript の環境を構築したら意外とハマり所が多かった。

書籍「JavaScript関数化プログラミング」のサンプルにある lodash を使ってみるため node 環境を構築。  
その後 TypeScript 化をして、ファイル更新時に node を自動再起動する設定も行った。  
TypeScript の公式通りの設定をするも nodemon が更新ファイルを認識しない等、所々つまづいた。


## 環境
 ```
 Windows10,
 VSCode バージョン: 1.60.0 (system setup)
 node v16.9.0 (scoop install)
 typescript 4.4.2
```

## このプロジェクトの実行
```shell
git clone https://github.com/hongo3/ts-base-windows.git
npm install
npm start
```
実行の成功と、ソースの変更で再起動されれば成功。  
以下、環境構築の手順を記す。

## 環境構築の手順
プロジェクトフォルダでnpmの初期化  
```shell
npm init
```

## lodashで動作確認
とりあえずJavaScriptの動作を確認。
```shell
npm i lodash
```

とりあえずサンプルを作ってロード(まだTypeScript環境は無い状態)
```javascript:index.js
const _ = require('lodash')
```

動作確認
```
node index.js
```

## TypeScript install
TypeScriptの環境を追加していく。

### (TS公式)Node.js & TypeScript のプロジェクト作成
https://typescript-jp.gitbook.io/deep-dive/nodejs

```shell
npm install typescript --save-dev (手元では -g でグローバルインストールした)
npm install @types/node --save-dev
npx tsc --init --rootDir src --outDir lib --esModuleInterop --resolveJsonModule --lib es6,dom --module commonjs
```

## 自動コンパイル＆実行
公式の通りにインストールしたらうまく動作しなかったので、若干修正した。

### (TS公式)「ボーナス： 自動でコンパイルと実行を行う」
https://typescript-jp.gitbook.io/deep-dive/nodejs

ts-node, nodemon 両方一度にインストール：
```shell
 npm install ts-node nodemon --save-dev
```

 package.json に追加
 *  --watch を修正した
 *  Windowsでは ```'ts-node'``` を ```\"ts-node\"``` にする。
 ```json:package.json
 "scripts": {
   "start": "npm run build:live",
   "build": "tsc -p .",
   "build:live": "nodemon --watch src --exec "\ts-node\" src/index.ts"
 },
```

以上で環境構築終了。
src 以下にTypeScriptを追加して ```npm start``` で実行する。


## 動作確認: lodash を使ってみる
```
npm install --save lodash @types/lodash
```

サンプル
```javascript:src/index.ts
import _ from 'lodash'

const isNotValid  = (val: any) => _.isUndefined(val) || _.isNull(val);
const notAllValid = (args: any) => _(args).some(isNotValid);

const a: boolean = notAllValid(['string', 0, null, undefined]);
const b: boolean = notAllValid(['string', 0, {}]);
console.log(`a`, a); // a true
console.log(`b`, b); // b false
```

以上、無事に動作すればOK。  

以降にトラブル解決したメモを記す。

## Trouble: ソースを更新しても node が再起動されない

TypeScriptの公式にある設定では nodemon が正常に働いていなかった。  
```--watch``` フラグには単純にフォルダ名を指定する必要がある。  
また、```--watch``` フラグには１つのフォルダのみ指定可能で、フラグは複数指定が可能。

```--watch ./src/**/*.ts ``` は誤り、```--watch src``` とする。(下記 nodemon も参照)


### (nodemon)Monitoring multiple directories
https://www.npmjs.com/package/nodemon
```
   Don't use unix globbing to pass multiple directories,
     e.g --watch ./lib/*, it won't work.
   You need a --watch flag per directory watched.
```

## Trouble: Windows では package.json の ts-node を "" で囲う
```--exec 'ts-node'``` は Windows だとエラーになる。```""``` で囲う必要あり。
### windowsでts-nodeが機能しない  
https://qiita.com/ryu110/questions/b0923e46b552e96ff4dc

 ```--exec \"ts-node\"```


## Trouble: Remove "type": "module" from package.json
JavaScript で import を利用するため、最初は ```"type": "module" ```  package.json に設定してみた。
しかしこれは、後に TypeScript の環境にした時にエラーになってしまったため、削除する。  
### Can't run my Node.js TypeScript project TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /app/src/App.ts
https://stackoverflow.com/questions/62096269/cant-run-my-node-js-typescript-project-typeerror-err-unknown-file-extension


ちなみに ```"type": "module"``` は以下を読んで設定していた。  
ts-node を使う時、これがエラーを引き起こす。  
### ECMAScript】importでSyntaxError
https://qiita.com/ROYH/items/4af792fb6bca7f5850c9


## Topic：lodash 推奨されていない模様
サンプルで利用した lodash は利用を控えたいという意見もあった。
### lodash やめ方
https://qiita.com/mizchi/items/af17f45d5653b76f6751

