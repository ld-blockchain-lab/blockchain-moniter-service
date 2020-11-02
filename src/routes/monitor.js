import express from 'express';
import jsonResponse from '../middlewares/jsonResponse';
import argsCheck from '../middlewares/argsCheck';
import apikeyParser from '../middlewares/apikeyParser';
import ERROR from '../const/ERROR.json';
import hub from '../hub';

const router = express.Router();

router.post('/task.json', apikeyParser, argsCheck('address', ['symbol', 'blockchain']), (req, res, next) => {
  const { body } = req;
  const tag = body.symbol || body.blockchain;
  const adaptor = hub[tag];
  if (!adaptor) {
    res.json_error_code = ERROR.NO_ADAPTOR.code;
    res.json_error = ERROR.NO_ADAPTOR.message;
    next();
    return;
  }
  if (body.test) {
    adaptor.test(body.address, req.apikey);
    res.json_data = {
      address: body.address,
      type: 'tx',
      symbol: adaptor.symbol,
      blockchain: adaptor.blockchain,
      monitored: true,
      test: true,
    };
    next();
  } else {
    adaptor.monitor(body.address, req.apikey).then((task) => {
      res.json_data = task.getData();
      next();
    }).catch((err) => {
      res.json_error_code = err.code;
      res.json_error = err.message;
      next();
    });
  }
}, jsonResponse);

export default router;
