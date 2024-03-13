import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
export const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000', // Adjust the origin as needed
    credentials: true // Allow credentials (cookies) to be sent cross-origin
  })
);

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

app.use(express.json());
app.use(cookieParser());

// Sample user data (replace this with your actual authentication logic)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// POST endpoint for authentication
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find the user by username and password (replace with your actual authentication logic)
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Set a cookie to authenticate the user
  res
    .cookie('authCookie', user.id, { httpOnly: true })
    .json({ message: 'Logged in successfully' });
});

// Protected POST endpoint
app.post('/protected-post', (req, res) => {
  // Check if the user is authenticated (replace with your actual authorization logic)
  return res.status(200).json({message: `${req.cookies} TESTING`})
  if (!req.cookies.authCookie) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Example: Validate request body
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ message: 'Missing data in request body' });
  }

  // Example: Perform some operation using the authenticated user's data
  // In this example, we're just echoing back the data received in the request
  res.json({ message: 'Protected POST route', data });
});
// Healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

const api = express.Router();

api.get('/hello', (req, res) => {
  res.status(200).send({ message: 'hello world' });
});

// Version the api
app.use('/api/v1', api);
