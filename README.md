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
<br />

- [nodejs](https://nodejs.org/en/download/prebuilt-installer)
- [MariaDB](https://mariadb.org/download/)
- [JDK 21](https://www.oracle.com/ca-en/java/technologies/downloads/#java21)

</details>

<!-- Frontend section -->
<details open><summary><b>Frontend</b></summary>
<br />

Setup :

```sh
git clone https://github.com/HMDOC/opensell-frontend -b legacy
cd opensell-frontend/
npm install
```

Create a file named `data.json` in the `src` directory with the following content :

```json
{
    "url": "<BACKEND_URL>"
}
```

</details>

<!-- Backend section -->
<details open><summary><b>Backend</b></summary>
<br />

Setup :

```sh
git clone https://github.com/HMDOC/opensell-backend -b legacy
cd opensell-backend
mvn install
```

Create a file named `env.properties` in the root directory with the following content :

```properties
SERVER_PORT=

# Email information
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_EMAIL=
SMTP_PASSWORD=

# Database information
DB_URL=jdbc:mariadb://localhost:3306/opensell
DB_USER=
DB_PWD=

SERVER_URL=

# The path where the images will be saved
UPLOAD_PATH=

# Frontend url
ALLOWED_URL=http://localhost:3000
```

To enable images :

```text
You need to create two folders one named "/ad-image" that will contain the images for the ads and the other "/customer-profil" will contain the profil pictures of the users. They need to be accessible by http like this : http://<BACKEND_URL>/ad-image/.
```

</details>

## Run the project

```sh
# Frontend
npm start

# Backend
mvn spring-boot:run
```

## Preview

### Login

![Login](https://raw.githubusercontent.com/HMDOC/readme-src/main/login.png)

### Home

![Home](https://raw.githubusercontent.com/HMDOC/readme-src/main/connected_option_in_main_page.png)

### My ads

![My Ads](https://raw.githubusercontent.com/HMDOC/readme-src/main/my-ads.png)

### Profile

![Profile](https://raw.githubusercontent.com/HMDOC/readme-src/main/profil.png)

### Settings

![Settings](https://raw.githubusercontent.com/HMDOC/readme-src/main/settings.png)
