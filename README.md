# Opensell (Frontend Side)

Opensell is a marketplace website that we developed during the course 420-412-MV (Project - Development of a Web Application) at the Cegep Marie-Victorin between January and May 2024.

![Home](https://raw.githubusercontent.com/HMDOC/readme-src/main/home3.png)

## Important links

- [Backend](https://github.com/HMDOC/opensell-backend/tree/legacy)

## Features

- Log in and register.
- Create and modify ads.
- Search ads with multiple filters such as price range, category, tags, shape and more.
- Change information about our account such as our phone number, bio, picture, etc.

## Technologies

### Frontend

- Typescript
- React
- Axios
- react-bootstrap
- react-modal

### Backend

- Java
- Spring Boot
- Lombok

## Installation
<!-- Dependencies -->
<details open><summary><b>External dependencies</b></summary>

- [nodejs](https://nodejs.org/en/download/prebuilt-installer)
- [MariaDB](https://mariadb.org/download/)
- [JDK 21](https://www.oracle.com/ca-en/java/technologies/downloads/#java21)

</details>

<!-- Backend section -->
<details open><summary><b>Backend</b></summary>

### Setup

Clone the repository.

```sh
git clone https://github.com/HMDOC/opensell-backend -b legacy
```

### Development

1. Create the containers by running `docker compose up -d` in the terminal.
2. Clone the image repository(opensell-images). This repository contains the images files that are referenced in `src/main/resources/data.sql`.

    ```shell
    git clone https://github.com/HMDOC/opensell-images
    ```

3. Almost all environment variables are handled by docker compose or the dev profile, so the only thing that you need to change is the `UPLOAD_PATH` environment variable, which tells Spring where to access and store images. This environment variable should contain the location on your machine of the `opensell-images` repository you just cloned before.

### Production

Here are the environment variables you need to set in production.

```properties
# (Optional) The default port is 8080.
SERVER_PORT=8080

# The profile that the application uses by default is dev.
ACTIVE_PROFILE=prod

# The keystore.p12 password for HTTPS.
SSL_KEY_STORE_PASSWORD=

# (Optional) The location of the keystore file, by default it is keystore.p12.
SSL_KEY_STORE=keystore.p12

# Database information
DB_URL=jdbc:mariadb://localhost:3306/opensell
DB_USERNAME=
DB_PASSWORD=

# All the information about the SMTP server.
SMTP_HOST=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=

# The urls that have permission to access the backend.
ALLOWED_URLS=

# The application's email that is used to send emails to customers.
SUPPORT_EMAIL=

# The path where the images(ad images, customer profile, etc.) are stored. 
UPLOAD_PATH=
```

</details>

<!-- Frontend section -->
<details open><summary><b>Frontend</b></summary>

### Setup

1. Clone the repository.

    ```sh
    git clone https://github.com/HMDOC/opensell-frontend -b legacy
    cd opensell-frontend/
    npm install
    ```

2. Create a file named `.env` in the root directory with the following content :

    ```properties
    VITE_BACKEND_URL=http://localhost:8080
    VITE_PORT=3000
    # (Optional) This is not necessary in dev mode.
    VITE_HTTPS=true
    ```

</details>

## Run the project in development

```sh
# Frontend
npm start

# Backend
./mvnw spring-boot:run -Dspring-boot.run.arguments="--UPLOAD_PATH=${THE_PATH_OF_THE_OPENSELL_IMAGES_REPOSITORY}"
```

## Preview

### Login

![Login](https://raw.githubusercontent.com/HMDOC/readme-src/main/login.png)

### Home

![Home](https://raw.githubusercontent.com/HMDOC/readme-src/main/connected_option_in_main_page.png)

### Catalog

![Catalog](https://raw.githubusercontent.com/HMDOC/readme-src/main/catalog.png)

### Ad view

![Ad view](https://raw.githubusercontent.com/HMDOC/readme-src/main/ad-view.png)

### My ads

![My Ads](https://raw.githubusercontent.com/HMDOC/readme-src/main/my-ads.png)

### Profile

![Profile](https://raw.githubusercontent.com/HMDOC/readme-src/main/profile.png)

### Settings

![Settings](https://raw.githubusercontent.com/HMDOC/readme-src/main/settings.png)
