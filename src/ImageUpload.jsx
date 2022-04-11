import firebase from 'firebase/compat/app';
import { Button } from '@mui/material';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
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
      console.log(e.target.files[0]);
    }
  };
  const handleUpload = (image) => {
    const fileName = image.name;
    const storageRef = ref(storage, `/images/${Date.now()}${image.name}`);
    console.log(storageRef);
    console.log(image);
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
          console.log('uploaded');
        });
        setProgress(0);
        setCaption('');
        setImage(null);
      }
    );
  };

  return (
    <div className='imageupload'>
      <progress className='imageupload__progress' value={progress} max='100' />
      <input
        type='text'
        placeholder='Enter a caption...'
        onChange={(e) => setCaption(e.target.value)}
        value={caption}
      />
      <input type='file' onChange={handleChange} />
      <Button
        className='imageupload__button'
        onClick={() => handleUpload(image)}
      >
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;
