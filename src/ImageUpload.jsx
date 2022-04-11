import firebase from 'firebase/compat/app';
import { Button, Input } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { db, storage } from './firebase-config';

import './ImageUpload.css';

const ImageUpload = (props) => {
  const [image, setImage] = useState(null);
  // const [url, setUrl] = useState('');
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = (image) => {
    const storageRef = ref(storage, `/images/${Date.now()}${image.name}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          console.log(url);
          const docRef = doc(db, 'posts', `post${Date.now()}`);
          const payload = {
            timestamp: firebase.firestore.Timestamp.now(),
            caption: caption,
            imageUrl: url,
            username: props.username,
          };
          await setDoc(docRef, payload);
        });
        setProgress(0);
        setCaption('');
        setImage(null);
      }
    );
  };

  return (
    <div className='imageupload'>
      <h3 className='imageupload__header'>Create Post</h3>
      <progress className='imageupload__progress' value={progress} max='100' />
      <Input
        type='text'
        placeholder='Enter a caption...'
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      />
      <input type='file' onChange={handleChange} />
      <Button
        variant='outlined'
        className='imageupload__button'
        onClick={() => handleUpload(image)}
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;
