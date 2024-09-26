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
<details open><summary><b>External dependencies</b></summary>

- [nodejs](https://nodejs.org/en/download/prebuilt-installer)
- [docker](https://www.docker.com/get-started/)
- [JDK 21](https://www.oracle.com/ca-en/java/technologies/downloads/#java21)

</details>
<br />

<!-- Images section -->
<details open><summary><b>Images server</b></summary>

Setup :

```shell
git clone https://github.com/HMDOC/opensell-images
npm install
```

</details>
<br />

<!-- Backend section -->
<details open><summary><b>Backend</b></summary>

Setup :

```sh
git clone https://github.com/HMDOC/opensell-backend
```

Create a file named `env.properties` in the root directory with the following content :

```properties
# The port of the backend.
SERVER_PORT=

# The url of the SMTP server. Ex: smtp-mail.outlook.com
SMTP_HOST=

# The port of the SMTP server. Ex: 587
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=

# The url that can make request to the backend. The only one you need is the one of the frontend
ALLOWED_URLS=

# The path where the image are going to be stored. This path should end with /public if you are using the image server.
IMAGE_SERVER_PATH=

# The url of the server that contain the image. Ex: http://localhost:$PORT
IMAGE_SERVER_URL=

# The information that will be given directly to the MongoDB container.
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
MONGO_INITDB_ROOT_DATABASE=
```

After running the project, you need to connect to the database container using [MongoDB Compass](https://www.mongodb.com/try/download/compass). Then you need to import the data from the adCategory, customer, and ad collections located at `./src/main/ressources/data`. The import order is adCategory.json, customer.json, and ad.json.
</details>
<br />

<!-- Frontend section -->
<details open><summary><b>Frontend</b></summary>

Setup :

```sh
git clone https://github.com/HMDOC/opensell-frontend
cd opensell-frontend/
npm install
```

Create a file named `.env.local` in the root directory with the following content :

```properties
# Port of the frontend
VITE_PORT=80
VITE_BACKEND_URL=
VITE_JWT_SECRET_KEY=

# URL of the image server, should finish with a /
VITE_IMAGES_SERVER_URL=

VITE_AD_IMAGES_FOLDER=ad-image/
VITE_CUSTOMER_PROFILE_FOLDER=customer-profile/
```

</details>

## Run the project

```sh
# Frontend
npm run dev

# Backend: run with your IDE or :
./mvnw spring-boot:run

# Images
npm start
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
