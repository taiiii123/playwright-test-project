# バックエンドのマルチステージビルド
FROM maven:3.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# pom.xmlを先にコピーして依存関係をキャッシュ
COPY pom.xml .
RUN mvn dependency:go-offline -B

# ソースコードをコピーしてビルド
COPY src ./src
RUN mvn clean package -DskipTests -B

# 本番環境用の軽量イメージ
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# ビルドされたJARファイルをコピー
COPY --from=builder /app/target/*.jar app.jar

# 非rootユーザーで実行
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
