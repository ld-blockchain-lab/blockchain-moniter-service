import express from 'express';
import Wallet from 'ethereumjs-wallet';
import jsonResponse from '../middlewares/jsonResponse';
import log from '../utils/log';

// const { Models, commonErrorHandler } = require('../db');
// const varsProvider = require('../middlewares/varsProvider');
// const jwtParser = require('../middlewares/jwtParser');

// const { Announcement, Deposit } = Models;

const router = express.Router();

/* GET home page. */
router.get('/t.json', (req, res, next) => {
  const w = Wallet.fromPrivateKey(Buffer.from('0c3b39df83bd09600ad692c5000ed053ce4b3d5631a335a8267fc8cfa6a4e112', 'hex'));
  res.json_data = { pub: w.getPublicKeyString(), add: w.getAddressString() };
  next();
}, jsonResponse);

router.post('/callback', (req, res, next) => {
  log('【获得hook回报】', req.body);
  next();
}, jsonResponse);

export default router;
