import express from 'express';
import Wallet from 'ethereumjs-wallet';
import mnemonic from 'mnemonic';
import jsonResponse from '../middlewares/jsonResponse';
import argsCheck from '../middlewares/argsCheck';
import { Models } from '../db';

// const varsProvider = require('../middlewares/varsProvider');
// const jwtParser = require('../middlewares/jwtParser');

const { Apikey } = Models;

const router = express.Router();

router.post('/key.json', argsCheck('webhook'), (req, res, next) => {
  Apikey.create({
    webhook: req.body.webhook,
  }).then((key) => {
    res.json_data = key.getData();
    next();
  });
}, jsonResponse);

router.post('/eth_address.json', (req, res, next) => {
  const wallet = Wallet.generate();
  const publicKey = wallet.getPublicKeyString();
  const privateKey = wallet.getPrivateKeyString();
  const address = wallet.getAddressString();
  const mnemonicWords = mnemonic.encode(privateKey.slice(2));
  const ret = {
    publicKey,
    privateKey,
    address,
    mnemonicWords,
  };
  res.json_data = ret;
  next();
}, jsonResponse);

export default router;
