import AuthApiService from "@/helpers/Api/authentication/Auth.service";
import BitCoinService from "@/helpers/Api/bitcoin/bitcoin.service";
import MoneroService from "@/helpers/Api/monero/xmr.service";
import { UserDetailsModel } from "@/helpers/interfaces/UserDetailsModel";
import { WalletDetailsModel } from "@/helpers/interfaces/walletDetailsModel";

export interface WalletAccountModel {
  accountInfo: UserDetailsModel;
  moneroDetails: WalletDetailsModel;
  btcDetails: WalletDetailsModel;
}

class BackedWalletAccount {
  private authenticationService: AuthApiService;
  private moneroService: MoneroService;
  private BtcService: BitCoinService;

  constructor(
    authenticationService: AuthApiService,
    moneroService: MoneroService,
    BtcService: BitCoinService
  ) {
    this.authenticationService = authenticationService;
    this.moneroService = moneroService;
    this.BtcService = BtcService;
  }

  async getAllMyAccountInfoWithWalletAddresses(): Promise<WalletAccountModel> {
    {
      try {
        const accountResponse = await this.authenticationService.getMyDetails();
        const walletResponse = await this.moneroService.getMymoneroWallet();
        const btcWalletResponse = await this.BtcService.getWalletAddress();
        if (!btcWalletResponse?.wallet_address) {
          throw new Error("Failed to get BTC wallet address");
        }

        if (!accountResponse?.data || !walletResponse?.data) {
          throw new Error("API response does not contain valid data.");
        }

        const accountInfo: UserDetailsModel = accountResponse.data;
        const monerodetails: WalletDetailsModel = walletResponse.data;
        const btcDetails: WalletDetailsModel = {
          wallet_address: btcWalletResponse.wallet_address,
        } as WalletDetailsModel;
        const walletAccountInfo: WalletAccountModel = {
          accountInfo: accountInfo,
          moneroDetails: monerodetails,
          btcDetails: btcDetails,
        };

        return walletAccountInfo;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
      }
    }
  }
}

export default new BackedWalletAccount(
  new AuthApiService(),
  new MoneroService(),
  new BitCoinService()
);
