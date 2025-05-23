export interface WalletDetailsModel {
    id: string;
    user_id: string;
    wallet_address: string;
    private_view_key: string;
    mnemonic: string;
    wallet_name: string;
    wallet_hashed_password: string;
    created_at: string;
    updated_at: string;
    live_balance: string;
}
