import { WalletAccountModel } from "@/app/(post-login)/wallets-and-accounts/backed/backed_wallet_account";
import xmobcolors from "@/app/styles/xmobcolors";
import XmobButton from "@/components/button/xmobitButton";
import MobitCard from "@/components/cards/xmobcard";
import XmobClipboard from "@/components/clipboard/xmobClipBoard";
import XmobImage from "@/components/images/xmobImage";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobText from "@/components/text/xmobText";
import { UserDetailsModel } from "@/helpers/interfaces/UserDetailsModel";

import { Box } from "@mui/material";
interface ProfileAcountComponentProps {
  walletAccountDetails: WalletAccountModel;
}
export default function ProfileComponent({ walletAccountDetails }: ProfileAcountComponentProps) {
  const FeedBackData: { label: string; total: string }[] = [
    { label: "Total", total: "0" },
    { label: "Trusted", total: "50" },
    { label: "Negative", total: "50" },
  ];
  function shortenString(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
  }

  return (
    <div>
      <MobitCard>
        <XmobText fontWeight="bold">Profile Details</XmobText>
        <Xmoblayout layoutType="grid-2" isResponsive={true}>
          <Xmoblayout layoutType="flex-col">
            <Xmoblayout layoutType="flex-row" isFlexEndToEndMobile={true}>
              <XmobImage
                src={walletAccountDetails.accountInfo.profile_pic_url}
                alt="logo"
                width="50px"
                height="50px"
                circular={true}
              />
              <Box>
                <XmobText>@User Status</XmobText>
                <XmobText>{walletAccountDetails.accountInfo.username}</XmobText>
              </Box>
              <XmobButton
                backgroundColor={xmobcolors.dark}
                borderRadius={6}
                isButtonSmall={true}
              >
                Edit
              </XmobButton>
            </Xmoblayout>

            <Xmoblayout layoutType="flex-col">
              <XmobitSpacer height={2} />
              <XmobText fontWeight="bold">Feedback Statistics</XmobText>
              <Xmoblayout layoutType="flex-row" gap="gap-5" isResponsive={true}>
                {FeedBackData.map((item, index) => (
                  <MobitCard key={index} isShadow={true} rounded={true}>
                    <Xmoblayout layoutType="flex-col">
                      <XmobText
                        fontWeight="bold"
                        textAlign="center"
                        variant="h6"
                      >
                        {item.label}
                      </XmobText>
                      <XmobText fontWeight="bold" textAlign="center">
                        {item.total}
                      </XmobText>
                    </Xmoblayout>
                  </MobitCard>
                ))}
              </Xmoblayout>
            </Xmoblayout>
            <XmobitSpacer height={2} />
            <Xmoblayout layoutType="flex-row" gap="gap-2">
              <XmobButton isCurrencyButton={true} isbtc={true} borderRadius={0}>
                sell BitCoin
              </XmobButton>
              <XmobButton
                isCurrencyButton={true}
                isbtc={false}
                borderRadius={0}
              >
                sell Xmr
              </XmobButton>
            </Xmoblayout>
          </Xmoblayout>

          {/* column 2 */}
          <Xmoblayout layoutType="flex-col">
            <MobitCard isShadow={true} rounded={true}>
              <Xmoblayout layoutType="flex-row">
                <XmobImage
                  src="/btc.png"
                  alt="logo"
                  width="30px"
                  height="30px"
                ></XmobImage>
                <XmobText fontWeight="bold">Bitcoin Address</XmobText>
              </Xmoblayout>
              <XmobText>Funding Address</XmobText>
              <MobitCard background={xmobcolors.primaryFaded}>
                <Xmoblayout layoutType="flex-row" isFlexEndToEnd={true}>
                  <XmobText>{walletAccountDetails.btcDetails.wallet_address}</XmobText>
                  <XmobClipboard text="Thia is the address"></XmobClipboard>
                </Xmoblayout>
              </MobitCard>
            </MobitCard>

            <MobitCard isShadow={true} rounded={true}>
              <Xmoblayout layoutType="flex-row">
                <XmobImage
                  src="/monero.png"
                  alt="logo"
                  width="30px"
                  height="30px"
                ></XmobImage>
                <XmobText fontWeight="bold">Monero Address</XmobText>
              </Xmoblayout>
              <XmobText>Funding Address</XmobText>
              <MobitCard background={xmobcolors.primaryFaded}>
                <Xmoblayout layoutType="flex-row" isFlexEndToEnd={true}>
                  <XmobText> {shortenString(walletAccountDetails.moneroDetails.wallet_address, 15)}</XmobText>
                  <XmobClipboard text={walletAccountDetails.moneroDetails.wallet_address}></XmobClipboard>
                </Xmoblayout>
              </MobitCard>
            </MobitCard>
          </Xmoblayout>
        </Xmoblayout>
      </MobitCard>
    </div>
  );
}
