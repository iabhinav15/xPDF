# PDF Splitter Web Application 

**[Link to Visit](https://pdfsplitter-abhinav.netlify.app "Visit")**

Welcome to the PDF Splitter web application! This application allows users to upload PDF files, select specific pages from the uploaded PDF, rearrange the selected pages, and download the customized PDF.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Application Structure](#application-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [How to use](#how-to-use)
- [Visual Appearance](#visual-appearance)
- [Api Documentation](#api-documentation)
- [Contributors](#contributors)
- [License](#license)

## Features

- **Upload PDF**: Users can upload PDF files.
- **Select Pages**: All pages of the uploaded PDF are displayed, and users can select specific pages by clicking on them.
- **Rearrange Pages**: Users can rearrange the order of selected pages by drag and drop.
- **Download PDF**: Once pages are selected, users can download the customized PDF containing only the selected pages.
- **Store PDF**: Uploaded PDFs are stored in the database for future reference.
- **User Authentication and Authorization**: The application requires users to sign in, ensuring data security and user-specific functionalities.
  
## Technologies Used

- **Next.js**: The web application is built using Next.js, a React framework for server-side rendering and static site generation.
- **MongoDB**: MongoDB is used as the database to store user data and uploaded PDFs.
- **Tailwind CSS**: Tailwind CSS is used to design the frontend part of application.
- **React-PDF**: React-PDF is used to display PDF files and interact with them.
- **PDF-lib**: PDF-lib is utilized to manipulate PDF files, such as splitting and merging pages.
- **react-beautiful-dnd**: react-beautiful-dnd is used to implement the drag and drop feature of PDF pages.
- **JSON Web Token(JWT)**: Used for authentication.
- **bcryptjs**: Used for hashing the password to store in database.


## Application Structure
The application follows a MVC architecture.

- Models: Define the data structure for MongoDB, represent the schema for user information and files.

- Controllers: Responsible for manage user authentication and file related operations.

- View: The view is the user interface, which is responsible for displaying the data and receiving the user's input.


## Prerequisites

List of software, tools, or dependencies required to run in local machine:

- Node.js (version 18.17 or later)
- MongoDB Compass or atlas only if want to see database  (version >= 6.X.X) or MongoDB Atlas
- macOS, Windows (including WSL), and Linux are supported.
- A code editor such as VS Code

## Installation

To run the application locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies by running `npm install`.
4. Start the development server by running `npm run dev`.
5. Access the application in your web browser at `http://localhost:3000`.

## How to use

1. Sign up or log in to the application.
2. Upload a PDF file using the provided interface.
3. Select the desired pages by clicking on them.
4. Rearrange the order of selected pages by dragging and dropping.
5. Click the "Download" button to generate and download the customized PDF file.
6. Stored PDFs can be accessed by clicking on All files.

## Visual Appearance

![alt text](/public/image-2.png)
![alt text](/public/image-1.png)
![alt text](/public/image.png)
![alt text](/public/image-4.png)
![alt text](/public/image-3.png)


## Api Documentation
**[Link to Visit](https://documenter.getpostman.com/view/30176049/2sA35A6Prf "Visit")**

## Contributors

- Abhinav Singh

## License

This project is licensed under the [MIT License](LICENSE).
