import express from 'express';
import logger from 'morgan';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import cors from 'cors';
import mysql from 'mysql';

dotenv.config();

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDDjI7yScWWii4x3kptJfG23jfyyRR-45k",
  authDomain: "hdb4-88d11.firebaseapp.com",
  projectId: "hdb4-88d11",
  storageBucket: "hdb4-88d11.appspot.com",
  messagingSenderId: "829021793366",
  appId: "1:829021793366:web:60dc8ecf1a5a862e4d9ff7",
  measurementId: "G-FS9VKQ1R2H"
};

// Inicializar Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Configuración de MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat_app'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

// Configuración de Express y Socket.io
const app = express();
app.use(cors());
const server = createServer(app);


const port = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Middleware de logging
app.use(logger('dev'));

// Middleware para permitir CORS desde la IP específica
app.use(cors());

// Middleware para servir archivos estáticos
app.use(express.static('client'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});


// Escuchar conexiones Socket.io
io.on('connection', (socket) => {
  console.log('a user has connected!');

    // Emitir evento de usuario conectado a todos los clientes
    socket.on('user connected', (username) => {
      io.emit('user connected', username);
    });

  socket.on('disconnect', () => {
    console.log('an user has disconnected');
    // Emitir evento de usuario desconectado a todos los clientes
    io.emit('user disconnected', Object.keys(io.sockets.sockets));
  });

  socket.on('chat message', async ({msg, sender}) => {
    //const username = socket.handshake.auth.username || 'anonymous';
    console.log({ sender });

    const query = 'INSERT INTO messages (username, content) VALUES (?, ?)';
    db.query(query, [sender, msg], (err, result) => {
      if (err) {
        console.error('Error inserting message into MySQL:', err);
        return;
      }
      console.log('Message inserted into MySQL:', result.insertId);
    });

    try {
      // Escribir mensaje en Firebase Realtime Database
      const messagesRef = ref(database, 'messages');
      await push(messagesRef, {
        content: msg,
        user: sender
      });


      io.emit('chat message', {msg, sender}); // Emitir mensaje a todos los clientes
    } catch (error) {
      console.error('Error writing message to Firebase:', error);
    }
  });
});



// Iniciar servidor
server.listen(port,'0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
