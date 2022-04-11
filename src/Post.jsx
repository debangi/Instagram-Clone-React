import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';

import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import Avatar from '@mui/material/Avatar';
import './Post.css';

import { db } from './firebase-config';
import { deepPurple } from '@mui/material/colors';

export const Post = ({ postId, username, caption, imageUrl, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (postId) {
      const q = query(
        collection(db, 'posts', `${postId}`, 'comments'),
        orderBy('timestamp', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
        );
      });
      return unsubscribe;
    }
  }, [postId]);

  const postComment = async (e) => {
    e.preventDefault();
    const commentsDocRef = doc(
      db,
      'posts',
      `${postId}`,
      'comments',
      `comment${Date.now()}`
    );
    const payload = {
      timestamp: firebase.firestore.Timestamp.now(),
      text: comment,
      username: currentUser.displayName,
    };
    await setDoc(commentsDocRef, payload);
    setComment('');
  };

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          sx={{ bgcolor: deepPurple[500] }}
          src='/broken-image.jpg'
          alt={username.toUpperCase()}
        />
        <h3>{username}</h3>
      </div>

      <img className='post__image' src={imageUrl} alt='postImage' />

      <h4 className='post__text'>
        <strong>{username}</strong> {caption}
      </h4>

      <div className='post__comments'>
        {comments.map(({ id, data }) => (
          <p key={id}>
            <b>{data.username}</b> {data.text}
          </p>
        ))}
      </div>

      {currentUser && (
        <form className='postComment__form'>
          <input
            className='postComment__input'
            type='text'
            placeholder='Add a comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className='postComment__button'
            type='submit'
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
