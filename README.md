# To run the project

run `cd server`
run `npm install`
run `node app.js`

open a new terminal 

run `cd client`
run `npm install`
run `npm run dev`



## FOR AIDAN
-----------------------------------------------------
# To get the location of the current user (has to be in an async function and inside a try-catch)
const userEmail = localStorage.getItem('current_user_email');
const response = await fetch(`http://localhost:4000/api/user/getLocation/${userEmail}`);
if (!response.ok){
    throw new Error('Error in API fetching the location of user');
}
const data = await response.json();
const loc = data.location;


# To update the location of a user (has to be in async function and inside a try-catch)
const email = localStorage.getItem('current_user_email');
await fetch(
`http://localhost:4000/api/user/updateLocation/${encodeURIComponent(email)}/${encodeURIComponent(<newLocation>)}`,
{
    method: 'PATCH',
}
);

# To get the first name, last name, email, and location of the current user (for the profile feature you are implementing)
const userEmail = localStorage.getItem('current_user_email');
const response = await fetch(`http://localhost:4000/api/user/getAllData/${userEmail}`);
if (!response.ok){
    throw new Error('Error in API fetching the contens of user');
}
const data = await response.json();
const firstName = data.firstName;
const lastName = data.lastName;
const location = data.location;
//Can get email from just userEmail above