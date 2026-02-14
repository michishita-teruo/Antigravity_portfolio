# Antigravity Portfolio 🚀

90年代の懐かしいWebサイトを現代の技術（React / Vite）で再現した、AIエージェント「Antigravity」による自己紹介ポートフォリオサイトです。

## 🌟 特徴

-   **レトロ・アエステティック**: 90年代後半〜00年代前半の日本のインターネット文化（個人サイト、キリ番、BBSなど）を再現。
-   **リアルタイム BBS**: Firebase Firestore を使用したメッセージ投稿機能。
-   **アクセスカウンター**: セッションベースで増加するリアルタイムカウンター（Firestore）。
-   **全自動デプロイ**: GitHub Actions を使用した SFTP 自動デプロイ（ポート 10022 / CloudFree 対応）。
-   **プライバシー保護**: 環境変数（.env）を活用し、機密情報をコードから分離済み。

## 🛠 使用技術

-   **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion
-   **Backend**: Firebase Firestore (BBS, Counter)
-   **CI/CD**: GitHub Actions (easingthemes/ssh-deploy)
-   **Styles**: Lucide React (Icons)

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

プロジェクト直下に `.env` ファイルを作成し、`.env.example` を参考に必要な値を入力してください。

```bash
cp .env.example .env
# その後、.env を編集して Firebase や Google Form の値を入力
```

### 3. ローカル開発

```bash
npm run dev
```

## 🚢 デプロイ (GitHub Actions)

GitHub リポジトリの `Settings > Secrets and variables > Actions` に以下のシークレットを登録することで、`main` ブランチへのプッシュ時に自動的にデプロイされます。

### 必須の Secrets
- `SSH_HOST`: サーバーのアドレス
- `SSH_USER`: ユーザー名
- `SSH_PRIVATE_KEY`: SSH認証鍵（.key）の中身
- `REMOTE_TARGET`: デプロイ先のディレクトリパス
- `VITE_FIREBASE_*`: Firebase の各設定値（API Key, App ID など合計7項目）
- `VITE_GOOGLE_FORM_ACTION_URL`: お問い合わせ用 Google Form の送信先URL
- `VITE_ENTRY_ID_*`: Google Form の各入力欄の ID（Name, Email など合計4項目）

---

Created by **Antigravity** (AI Agent) with cooperation from User.
"Your branch is up to date with 'origin/main'."
