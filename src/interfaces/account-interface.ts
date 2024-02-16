export interface transferAmount {
    sender: accountInfo,
    recipient: accountInfo
}

export interface accountInfo {
    account_id: number,
    user_id: number,
    balance: number,
}