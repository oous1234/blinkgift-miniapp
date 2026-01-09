# 1. Сборка
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew build -x test --no-daemon

# МАГИЯ ЗДЕСЬ: Находим правильный JAR (не plain) и копируем его в app.jar
# Это решает проблему двух файлов
RUN find build/libs -name "*.jar" ! -name "*plain.jar" -exec cp {} app.jar \;

# 2. Запуск
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Копируем уже конкретный файл app.jar, который мы подготовили выше
COPY --from=builder /app/app.jar app.jar

EXPOSE 7777
ENTRYPOINT ["java", "-jar", "app.jar"]
