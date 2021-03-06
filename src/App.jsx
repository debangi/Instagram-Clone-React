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
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

import './App.css';
import ImageUpload from './ImageUpload';

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
  ///// useState
  const [posts, setPosts] = useState([]);
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState({});

  ///// useEffect
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentLoggedInUser(currentUser);
    });
  }, [currentLoggedInUser, username]);
  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
    });
    return unsubscribe;
  }, []);

  ///// handler functions
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
      handleClose();
      const user = await createUserWithEmailAndPassword(auth, email, password);
      updateProfile(auth.currentUser, {
        displayName: username,
      }).then(() => {
        setCurrentLoggedInUser(user);
      });
      setCurrentLoggedInUser(user);
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (e) {
      console.log(e.message);
    }
  };
  const signIn = async (e) => {
    e.preventDefault();
    try {
      handleClose();
      const user = await signInWithEmailAndPassword(auth, email, password);
      setCurrentLoggedInUser(user);
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (e) {
      console.log(e.message);
    }
  };
  const logout = async (e) => {
    await signOut(auth);
  };
  const scrollToBottom = () => {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className='app'>
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
        {currentLoggedInUser ? (
          <div>
            <Button onClick={logout}>Logout</Button>
            <Button variant='contained' onClick={scrollToBottom}>
              POST
            </Button>
          </div>
        ) : (
          <div className='app__loginContainer'>
            <Button onClick={handleOpenSignUp}>Sign Up</Button>
            <Button onClick={handleOpenSignIn}>Sign In</Button>
          </div>
        )}
      </div>

      <div className='app__posts'>
        {posts.map(({ id, data }) => (
          <Post
            currentUser={currentLoggedInUser}
            key={id}
            postId={id}
            username={data.username}
            caption={data.caption}
            imageUrl={data.imageUrl}
          />
        ))}
      </div>

      {currentLoggedInUser?.displayName ? (
        <ImageUpload username={currentLoggedInUser.displayName} />
      ) : (
        <h3>Sorry! You need to login to upload!</h3>
      )}
    </div>
  );
}

export default App;
