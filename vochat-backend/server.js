

const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const cors = require('cors');
const history = require('connect-history-api-fallback');
const http = require('http');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminRoutes = require('./routes/admin');
// Load env variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

// MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ email: profile.emails[0].value });
  if (!user) {
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
    });
  } else if (!user.googleId) {
    user.googleId = profile.id;
    await user.save();
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) =>
  User.findById(id).then(user => done(null, user))
);

// Routes
app.use('/auth', authRoutes);
app.use(history());
app.use('/api/admin', adminRoutes);

// === Voice Upload ===
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.post('/upload-voice', upload.single('voice'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});
app.use('/uploads', express.static(uploadDir));

// === Socket.io Logic ===
const activeUsers = new Map();
const waitingTalkers = [];

io.on('connection', (socket) => {
  console.log(' New connection:', socket.id);

  socket.on('register', ({ role, userId }) => {
    socket.data.userId = userId;
    socket.data.role = role;
    activeUsers.set(userId, socket);

    if (role === 'Talker') {
      waitingTalkers.push({ userId, socket });
      attemptMatch();
    }
  });

  socket.on('send_message', ({ to, message }) => {
    const from = socket.data.userId;
    const msg = { from, to, message };

    const receiverSocket = activeUsers.get(to);
    const senderSocket = activeUsers.get(from);

    if (senderSocket) senderSocket.emit('receive_message', msg);
    if (receiverSocket) receiverSocket.emit('receive_message', msg);
  });

  socket.on('send_voice', ({ to, url }) => {
    const from = socket.data.userId;
    const msg = { from, to, voiceUrl: url };

    const receiverSocket = activeUsers.get(to);
    const senderSocket = activeUsers.get(from);

    if (senderSocket) senderSocket.emit('receive_message', msg);
    if (receiverSocket) receiverSocket.emit('receive_message', msg);
  });

  socket.on('disconnect', () => {
    const { userId } = socket.data;
    activeUsers.delete(userId);
    console.log(' Disconnected:', socket.id);
  });
});

function attemptMatch() {
  while (waitingTalkers.length > 0) {
    const { userId, socket: talkerSocket } = waitingTalkers.shift();
    const listenerEntry = [...activeUsers.entries()].find(
      ([_, sock]) => sock.data.role === 'Listener'
    );

    if (!listenerEntry) {
      waitingTalkers.unshift({ userId, socket: talkerSocket });
      break;
    }

    const [listenerId, listenerSocket] = listenerEntry;
    talkerSocket.emit('matched', { userId: listenerId });
    listenerSocket.emit('matched', { userId });
  }
}

// Start Server
server.listen(process.env.PORT, () =>
  console.log(` Server running at http://localhost:${process.env.PORT}`)
);
