# Base image for running the ASP.NET Core API
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["backend/Celestia.Api/Celestia.Api.csproj", "backend/Celestia.Api/"]
RUN dotnet restore "backend/Celestia.Api/Celestia.Api.csproj"

# Copy the rest of the source code
COPY . .
WORKDIR "/src/backend/Celestia.Api"
RUN dotnet build "Celestia.Api.csproj" -c Release -o /app/build

# Publish the app
FROM build AS publish
RUN dotnet publish "Celestia.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Render exposes PORT environment variable dynamically, ASP.NET Core reads this to bind the port
ENV ASPNETCORE_URLS=http://+:80
ENTRYPOINT ["dotnet", "Celestia.Api.dll"]
