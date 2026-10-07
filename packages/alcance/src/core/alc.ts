import alc from '../../package.json'
import logger from '../components/utils/logger';
type AlcTypes = {
  version: string;
}

const ALC: AlcTypes = {
  version: alc.version,
};

logger.debug('Core do ALC executado.');

export default ALC;
