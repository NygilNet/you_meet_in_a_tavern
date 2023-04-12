# You Meet In A Tavern

## Project Description

You Meet In A Tavern, a MeetUp clone, is an app where you form groups and events, specifically through a tabletop roleplaying game (TTRPG) lens.

## Deployed Live Link

[You Meet In A Tavern](https://you-meet-in-a-tavern.onrender.com/)

## Technologies/Frameworks Used

* [Express](https://expressjs.com/)

* [React](https://reactjs.org/)

* Backend Dependencies

    * bcryptjs: ^2.4.3
    * cookie-parser: ^1.4.6
    * cors: ^2.8.5
    * csurf: ^1.11.0
    * dotenv: ^16.0.3
    * express: ^4.18.2
    * express-async-errors: ^3.1.1
    * helmet: ^6.0.1
    * jsonwebtoken: ^9.0.0
    * morgan: ^1.10.0
    * per-env: ^1.0.2
    * pg: ^8.8.0
    * sequelize: ^6.28.0
    * sequelize-cli: ^6.5.2
    * start: ^5.1.0

* Frontend Dependencies

    * @testing-library/jest-dom: ^5.16.5
    * @testing-library/react: ^11.2.7
    * @testing-library/user-event: ^12.8.3
    * js-cookie: ^3.0.1
    * react: ^18.2.0
    * react-dom: ^18.2.0
    * react-redux: ^8.0.5
    * react-router-dom: ^5.3.4
    * react-scripts: 5.0.1
    * redux: ^4.2.1
    * redux-thunk: ^2.4.2

## MVP Core Features

* Users

	* Sign Up (Create), Log In (Read), Log Out

* Groups

	* Create, Read, Update, Delete

* Events

    * Create, Read, Delete

## Screenshots

![you_meet_in_a_tavern_home](https://user-images.githubusercontent.com/109548330/231595937-742b2706-6d54-476c-84d2-4c9d5476639b.jpg)

![you_meet_in_a_tavern_list_events](https://user-images.githubusercontent.com/109548330/231596879-8f6b36df-39d8-4562-9d53-1910bfe8e595.jpg)

![you_meet_in_a_tavern_group](https://user-images.githubusercontent.com/109548330/231596889-08129030-a5e5-4575-8322-2737bc133174.jpg)

## Future Implementation Goals

- [ ] Add AWS bucket for adding images

- [ ]  Complete CRUD on groups and events

- [ ] Search

- [ ] Images


## Getting Started

After you clone this project you will need to follow the next steps:

1. Install dependencies by running pipenv install using the requirements.txt file

	```bash
	pipenv install -r requirements.txt
	```
2. Create a .env file based your environments

	This file should include:
	* A SECRET_KEY so csrf calls can be made
	* A SCHEMA unique to your database
	* The DATABASE_URL where your database is located

3. You can enter the pipenv, migrate the database, and run the flask app by running the follow commands

	```bash
	pipenv shell
	```

	```bash
	flask db upgrade
	```

	```bash
	flask seed all
	```

	```bash
	flask run
	```

4. In order to run the React App, run the following commands

	```bash
	cd react-app
	```

	```bash
	npm install
	```

	```bash
	npm start
	```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## Contact

[LinkedIn](https://www.linkedin.com/in/nygil-nettles-dev/)

[GitHub](https://github.com/NygilNet)

## Acknowledgments

* [Font Awesome](https://fontawesome.com/)

* [Unsplash](https://unsplash.com/)

* [Imgur](https://imgur.com)

* [Render](https://render.com/)
