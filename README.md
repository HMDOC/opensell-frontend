# Opensell 2.0 (Frontend Side)

Opensell is a marketplace website that we developed during the course 420-412-MV (Project - Development of a Web Application) at the Cegep Marie-Victorin between January and May 2024. In the summer of the same year, the frontend and backend project structure was modified, the site's UI was optimized and redesigned using the MUI library. The backend was also optimized and the original database (Mariadb) was replaced by MongoDB.

![Home](https://raw.githubusercontent.com/HMDOC/readme-src/refs/heads/main/markdown-images/cover.png)

## Important links

- [Backend](https://github.com/HMDOC/opensell-backend)

## Features

- Log in and register.
- Create and modify ads.
- Search ads with multiple filters such as price range, category, tags, shape and more.
- Change information about our account such as our phone number, bio, picture, etc.

## Technologies

### Database

- MongoDB

### Backend

- Java
- Spring Boot
- Lombok
- docker-compose

### Frontend

- Typescript
- React
- Axios
- MUI

## Installation
<!-- Dependencies -->
<details open><summary><b style="font-size: 23px">External dependencies</b></summary>

- [nodejs](https://nodejs.org/en/download/prebuilt-installer)
- [docker](https://www.docker.com/get-started/)
- [JDK 21](https://www.oracle.com/ca-en/java/technologies/downloads/#java21)

</details>
<br />

<!-- Backend section -->
<details open><summary><b style="font-size: 23px">Backend</b></summary>

### Setup

Clone the repository.

```sh
git clone https://github.com/HMDOC/opensell-backend
```

### Development

1. Create the containers by running `docker compose up -d` in the terminal.
2. Connect to the MongoDB container with the credentials locate at `docker-compose.yml` using [MongoDB Compass](https://www.mongodb.com/try/download/compass). Then you need to import the data from the adCategory, customer, and ad collections located at `./src/main/ressources/data`. The import order is adCategory.json, customer.json, and ad.json.
3. Clone the image repository(opensell-images). This repository contains the images files that are referenced in the MongoDB database.
    ```shell
    git clone https://github.com/HMDOC/opensell-images
    ```
4. Almost all environment variables are handled by docker compose or the dev profile, so the only thing that you need to change is the `APP_IMAGE_SERVER_PATH` environment variable, which tells Spring where to access and store images. This environment variable should contain the location on your machine of the `opensell-images` repository you just cloned before.

### Production

Here are the environment variables you need to set in production.

```properties
# (Optional) The default port is 8080.
SERVER_PORT=8080

# The profile the application will use, by default it is dev.
ACTIVE_PROFILE=prod

# The keystore.p12 password for HTTPS.
SSL_KEY_STORE_PASSWORD=

# (Optional) The location of the keystore file, by default it is keystore.p12.
SSL_KEY_STORE=keystore.p12

# Database URI
MONGO_DB_URI=

# All the information about the SMTP server.
SMTP_HOST=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=

# The urls that have permission to access the backend.
APP_ALLOWED_URLS=

# The application's email that is used to send emails to customers.
APP_SUPPORT_EMAIL=

# The path of where the images(ad images, customer profile, etc.) are stored. 
APP_IMAGE_SERVER_PATH=
```
</details>
<br />

<!-- Frontend section -->
<details open><summary><b style="font-size: 23px">Frontend</b></summary>

### Setup

1. Clone the repository.
   ```sh
   git clone https://github.com/HMDOC/opensell-frontend
   cd opensell-frontend/
   npm install
   ```

2. Create a file named `.env.local` in the root directory with the following content :
   ```properties
   # Port of the frontend
   VITE_PORT=3000
   VITE_JWT_SECRET_KEY=
   VITE_BACKEND_URL=
   
   # The backend url to get the images(ad images, customer profile, etc.). You only need to change the host and the port if needed.
   VITE_IMAGES_SERVER_URL=http://localhost:8080/api/file/
   
   # These are used to specify which route to get for each image type.
   VITE_AD_IMAGES_FOLDER=ad-image/
   VITE_CUSTOMER_PROFILE_FOLDER=customer-profile/
   ```

</details>

## Run the project in development

```sh
# Frontend
npm run dev

# Backend
./mvnw spring-boot:run -Dspring-boot.run.arguments="--APP_IMAGE_SERVER_PATH=${THE_PATH_OF_THE_OPENSELL_IMAGES_REPOSITORY}"
```

## Preview

### Sign up

![Signup](https://raw.githubusercontent.com/HMDOC/readme-src/refs/heads/main/markdown-images/signup.png)

### Home

![Home](https://raw.githubusercontent.com/HMDOC/readme-src/refs/heads/main/markdown-images/home.png)

### Catalog

![Catalog](https://raw.githubusercontent.com/HMDOC/readme-src/refs/heads/main/markdown-images/catalog.png)

### My ads

![My Ads](https://raw.githubusercontent.com/HMDOC/readme-src/refs/heads/main/markdown-images/my-ads.png)

### Profile

![Profile](https://raw.githubusercontent.com/HMDOC/readme-src/refs/heads/main/markdown-images/profile.png)

### Setting

![Settings](https://raw.githubusercontent.com/HMDOC/readme-src/refs/heads/main/markdown-images/settings.png)
