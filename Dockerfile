# Stage 1: Build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/.mvn .mvn
COPY backend/mvnw .
COPY backend/mvnw.cmd .
COPY backend/src src
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENV PORT=8080
EXPOSE ${PORT}
ENTRYPOINT ["java", "-jar", "app.jar"]
