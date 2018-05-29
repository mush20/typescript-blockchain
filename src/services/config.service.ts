import { Service } from 'typedi';
import config from '../config';

@Service()
export class ConfigService {

    get DIFFICULTY(): number {
        return config.DIFFICULTY;
    }

    get MINE_RATE(): number {
        return config.MINE_RATE;
    }
}