import React from 'react';
import Avatar from '@mui/material/Avatar';
import './Post.css';

export const Post = ({ username, caption, imageUrl }) => {
  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar
          className='post__avatar'
          src='/broken-image.jpg'
          alt='Debangi'
        />
        <h3>{username}</h3>
      </div>

      <img className='post__image' src={imageUrl} alt='postImage' />

      <h4 className='post__text'>
        <strong>{username}</strong> {caption}
      </h4>
    </div>
  );
};

export default Post;
