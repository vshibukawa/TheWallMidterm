# Midterm Project 'The Wall.'

## Screenshots
!['Screenshot Of Homepage'](https://github.com/basktballer/TheWallMidterm/blob/master/docs/desktop-home.png)
!['Screenshot Of Individual Resource'](https://github.com/basktballer/TheWallMidterm/blob/master/docs/addResorce.png)
!['Screenshot Of Adding Resource'](https://github.com/basktballer/TheWallMidterm/blob/master/docs/addResorce.png)
!['Screenshot Of Changing Profile'](https://github.com/basktballer/TheWallMidterm/blob/master/docs/changeProfile.png)

## Getting Started

### Prerequisites
- NODEJS (v8.10.0)
```
sudo apt install nodejs
```
- NPM (v8.9.4)
```
sudo apt install npm
```

### Installing
Once you have NodeJS and NPM running, follow the instructions below:

1. Clone this repository (do not fork)
2. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
3. Update the .env file with your correct local information
4. Install dependencies: `npm i`
5. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB

### Starting
To start the app run the following command from the main folder (That includes package.json):
```
npm run local
```

Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- bcrypt 3.0.6 or above
- body-parser 1.15.2 or above
- cookie-session 1.3.3 or above
- dotenv 2.0.0 or above
- ejs 2.4.1 or above
- express 4.13.4 or above
- jquery-bridget 2.0.1 or above
- knex 0.11.7 or above
- knex-logger 0.1.0 or above
- morgan 1.7.0 or above
- node-sass-middleware 0.9.8 or above
- pg 6.0.2 or above
- querystring 0.2.0 or above
- url 0.11.0 or above

## Upcoming Features

1. Auto-hiding/collapsable SIDEBAR
2. The ability to edit/delete comments
3. Displaying Images/videos via relevant urls being entered (Meta data scraping).
4. Passport/Oauth2 integration
5. Pregenerated dropdown in the 'Add Resource' window of existing categories.
6. Image uploading for avatars, not just URL linking
7. Allow comments to have replies
8. Allowing Resources to have multiple categories.
9. Full integration of mobile responsiveness.
