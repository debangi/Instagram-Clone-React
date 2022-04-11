import { useEffect, useState } from 'react';
import Post from './Post';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Input } from '@mui/material';
import { db, auth } from './firebase-config';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';

import './App.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
function App() {
  const [posts, setPosts] = useState([]);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentLoggedInUser(currentUser);
    });
  }, []);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleClose = () => {
    setOpenSignIn(false);
    setOpenSignUp(false);
  };
  const handleOpenSignUp = () => {
    setOpenSignUp(true);
  };
  const handleOpenSignIn = () => {
    setOpenSignIn(true);
  };
  const signUp = async (e) => {
    e.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(auth.currentUser, {
        displayName: username,
      });
      setCurrentLoggedInUser(user);
      handleClose();
    } catch (e) {
      console.log(e.message);
    }
  };
  const signIn = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      setCurrentLoggedInUser(user);
      handleClose();
    } catch (e) {
      console.log(e.message);
    }
  };
  const logout = async (e) => {
    await signOut(auth);
  };
  return (
    <div className='app'>
      {/* Caption */}
      {/* File Picker */}
      {/* Post button */}
      <Modal open={openSignUp} onClose={handleClose}>
        <Box sx={style}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='logo'
              />
            </center>
            <Input
              placeholder='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}>
              Sign up
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal open={openSignIn} onClose={handleClose}>
        <Box sx={style}>
          <form className='app__signup'>
            <center>
              <img
                className='app__headerImage'
                src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                alt='logo'
              />
            </center>
            <Input
              placeholder='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>
              Sign In
            </Button>
          </form>
        </Box>
      </Modal>

      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='logo'
        />
      </div>
      {currentLoggedInUser ? (
        <Button onClick={logout}>Logout</Button>
      ) : (
        <div className='app__loginContainer'>
          <Button onClick={handleOpenSignUp}>Sign Up</Button>
          <Button onClick={handleOpenSignIn}>Sign In</Button>
        </div>
      )}

      <h1>HELLO WORLD</h1>

      {posts.map(({ id, data }) => (
        <Post
          key={id}
          username={data.username}
          caption={data.caption}
          imageUrl={data.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
