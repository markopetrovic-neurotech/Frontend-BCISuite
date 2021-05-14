/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/order */
import React, { useEffect, Suspense, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div>
      <Link to="/brain">Brain View</Link>
      <Link to="/">Home View</Link>
    </div>
  );
}
