import { Service, Container } from 'typedi';
import { TransactionPoolService } from '@app/services/transaction-pool.service';
import { Transaction } from '@app/models';

@Service()
export class MinerService {

    private _transactionPoolService: TransactionPoolService = Container.get(TransactionPoolService);

    mine() {
        const validTransactions: Transaction[] = this._transactionPoolService.validTransactions();


    }
}