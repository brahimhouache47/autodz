import React from 'react';

export default function Footer() {
  return (
    <p className="bg-secondary text-white text-center ">
      &copy; Tous les droits reserve {new Date().getFullYear()}
    </p>
  );
}
