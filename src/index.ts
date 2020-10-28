import cors from 'cors';
import express from 'express';
import log4js from 'log4js';
import BaseRouter from './routes';

export const app = express();
export const logger = log4js.getLogger();

log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    default: {
      type: 'file',
      filename: 'logs/layer.log',
      pattern: '-yyyy-MM-dd',
      compress: true
    }
  },
  categories: {
    default: {
      appenders: ['default', 'console'],
      level: 'DEBUG'
    }
  }
});
logger.level = 'ALL';

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', BaseRouter);
