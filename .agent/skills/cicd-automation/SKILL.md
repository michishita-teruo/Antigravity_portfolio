---
name: cicd-automation
description: GitHub Actions と SFTP を使用した静的サイトの自動ビルド・デプロイを管理するためのスキル
---

# CI/CD Automation Skill

このスキルは、コードの変更を自動的に検知し、ビルド、テスト、そして本番サーバーへの安全な同期を行うためのパイプラインを構築・維持するためのものです。

## 🚀 コア・ワークフロー

### 1. GitHub Actions 構成
- **タイミング**: `main` ブランチへのプッシュをトリガーにする。
- **環境**: Ubuntu 最新版 (`ubuntu-latest`) を使用。
- **デプロイ**: `easingthemes/ssh-deploy` アクションを活用。

### 2. 環境変数の注入（Vite）
本番ビルド前に GitHub Secrets から値を読み込み、`.env` ファイルを生成する手順。
```bash
echo "VITE_FIREBASE_API_KEY=${{ secrets.VITE_FIREBASE_API_KEY }}" >> .env
```

### 3. デプロイ設定の最適化
- **REMOTE_TARGET**: サーバー上の正確な公開ディレクトリを指定。
- **海外IP制限の回避**: GitHub Actions の IP がサーバー側で制限されている場合、セキュリティ設定の緩和や特定 IP のホワイトリスト化を検討する。
- **PORT**: デフォルト (22) 以外（例: CloudFree の 10022）の場合は明示的に設定。
- **SSH**: `StrictHostKeyChecking: no` を検討し、対話的プロンプトを回避する。
- **SOURCE**: `dist/` ディレクトリのみを転送対象とする。

## 🛠 トラブルシューティング

1. **SSH 接続エラー**: Private Key の末尾に改行が含まれているか、およびホストキーの検証設定を確認する。
2. **パス不一致**: `REMOTE_TARGET` が絶対パスであることを確認する。
3. **ビルド失敗**: `npm install` 時の依存関係の整合性をログから追跡する。

## 🚫 禁止事項
- **Secrets の直書き**: いかなる環境変数も YAML ファイル内に値を直接記述してはならない。
- **全ファイル転送**: `node_modules` など不要なファイルを含めないよう、`SOURCE` フィルタを徹底する。
