# Midterm Project 'The Wall.'

## Getting Started.

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

## Features

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
