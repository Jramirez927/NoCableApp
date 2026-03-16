# Stage 1: Build React frontend
FROM public.ecr.aws/docker/library/node:22-alpine AS frontend-build
WORKDIR /frontend
COPY nocableapp.client/package.json nocableapp.client/package-lock.json ./
RUN npm ci
COPY nocableapp.client/ ./
RUN npm run build

# Stage 2: Restore + publish .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src
COPY NoCableApp.Server/NoCableApp.Server.csproj NoCableApp.Server/
RUN dotnet restore NoCableApp.Server/NoCableApp.Server.csproj
COPY NoCableApp.Server/ NoCableApp.Server/
COPY --from=frontend-build /frontend/dist/ NoCableApp.Server/wwwroot/
RUN dotnet publish NoCableApp.Server/NoCableApp.Server.csproj \
    -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
RUN mkdir -p /app/data
COPY --from=backend-build /app/publish ./
ENV ASPNETCORE_HTTP_PORTS=8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/NoCableApp.db"
EXPOSE 8080
ENTRYPOINT ["dotnet", "NoCableApp.Server.dll"]
