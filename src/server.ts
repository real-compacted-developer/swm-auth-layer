import { app, logger } from './index';

const PORT = 8080;
app.listen(PORT, () => logger.info(`Auth layer server listening on ${PORT}`));
