import express from 'express';
import { currentUser } from '@sayinmehmet-ticketing/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null }); // This is the new way of doing it
});

export { router as currentUserRouter };
