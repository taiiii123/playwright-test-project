# フロントエンドのマルチステージビルド
FROM node:18-alpine AS builder

WORKDIR /app

# 依存関係のインストール
COPY package*.json ./
RUN npm ci

# ソースコードのコピーとビルド
COPY . .
# 型チェックをスキップしてビルドのみ実行（Dockerビルドを高速化）
RUN npx vite build

# 本番環境用の軽量イメージ
FROM nginx:alpine

# ビルドされたファイルをnginxにコピー
COPY --from=builder /app/dist /usr/share/nginx/html

# nginxの設定ファイル
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
