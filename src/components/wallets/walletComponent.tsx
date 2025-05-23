import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import TokenService from '@/helpers/Token/token.service';
import AxiosInstance from '@/helpers/security/interceptors/http.interceptor';
import { baseUrl } from '@/helpers/constants/baseUrls';
import { usePathname } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Group all API calls into a single service object
const WalletService = {
  fetchBitcoinDetails: async () => {
    const token = await TokenService.getToken();
    const { data } = await AxiosInstance.get(`${baseUrl}/bitcoin/getadress`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  fetchBtcFundingBal: async () => {
    const token = await TokenService.getToken();
    const { data } = await AxiosInstance.get(`${baseUrl}/bitcoin/getbalance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  fetchBitcoinSpotDetails: async () => {
    const token = await TokenService.getToken();
    const { data } = await AxiosInstance.get(`${baseUrl}/btc/spot/my-details`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  fetchMoneroDetails: async () => {
    const token = await TokenService.getToken();
    const { data } = await AxiosInstance.get(`${baseUrl}/monero/get-my-wallet-details`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
  },

  fetchXMRSpotBal: async () => {
    const token = await TokenService.getToken();
    const { data } = await AxiosInstance.get(`${baseUrl}/monero/x_monero_spot_wallet_balance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
  }
};

export default function WalletComponent() {
  const btcQrRef = useRef<SVGSVGElement>(null);
  const xmrQrRef = useRef<SVGSVGElement>(null);

  const [copiedStates, setCopiedStates] = useState({
    btc: false,
    xmr: false
  });

  const path = usePathname();
  const websiteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  // React Query hooks for fetching data
  const { data: bitcoinData, isLoading: btcLoading } = useQuery({
    queryKey: ['bitcoin-address'],
    queryFn: WalletService.fetchBitcoinDetails,
  });

  const { data: btcBalData, isLoading: btcBalLoading } = useQuery({
    queryKey: ['btc-bal'],
    queryFn: WalletService.fetchBtcFundingBal,
  });

  const { data: bitcoinSpotData, isLoading: btcSpotLoading } = useQuery({
    queryKey: ['bitcoin-spot'],
    queryFn: WalletService.fetchBitcoinSpotDetails,
  });

  const { data: moneroData, isLoading: xmrLoading } = useQuery({
    queryKey: ['monero-wallet'],
    queryFn: WalletService.fetchMoneroDetails,
  });

  const { data: xmrSpotBalData, isLoading: xmrSpotBalLoading } = useQuery({
    queryKey: ['xmr-spot-bal-data'],
    queryFn: WalletService.fetchXMRSpotBal,
  });

  // Generate QR code values that include the website URL
  const getQrValue = (type: 'btc' | 'xmr') => {
    if (type === 'btc') {
      if (!bitcoinData?.wallet_address) return "";
      return `${websiteUrl}/send/${bitcoinData.wallet_address}`;
    } else {
      if (!moneroData?.wallet_address) return "";
      return `${websiteUrl}/send/${moneroData.wallet_address}`;
    }
  };

  // Function to download QR code as an image
  const downloadQR = (walletType: string, ref: React.RefObject<SVGSVGElement>) => {
    if (!ref.current) return;

    // Create a canvas to draw the SVG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(ref.current);
    const img = new Image();

    // Set canvas size
    canvas.width = 200;
    canvas.height = 200;

    // Create a data URL from the SVG
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      // Convert canvas to PNG and trigger download
      const downloadLink = document.createElement('a');
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.download = `${walletType}-wallet-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = url;
  };

  // Function to copy wallet address to clipboard with visual feedback
  const copyToClipboard = (address: string, type: 'btc' | 'xmr') => {
    if (!address) return;

    navigator.clipboard.writeText(address).then(() => {
      setCopiedStates(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }));
      }, 2000);
    });
  };

  // Wallet card component to reduce duplication
  const WalletCard = ({
    type,
    title,
    logoSrc,
    badgeText,
    badgeColor,
    spotBalance,
    fundingBalance,
    unlockedBalanced,
    walletAddress,
    isLoading,
    qrRef
  }: {
    type: 'btc' | 'xmr',
    title: string,
    logoSrc: string,
    badgeText: string,
    badgeColor: string,
    spotBalance: string | undefined,
    fundingBalance: string | undefined,
    unlockedBalanced?: string | undefined //Monero
    walletAddress: string | undefined,
    isLoading: boolean,
    qrRef: any
  }) => {
    const isAddressLoading = type === 'btc' ? btcLoading : xmrLoading;
    const isSpotLoading = type === 'btc' ? btcSpotLoading : xmrSpotBalLoading;
    const isBalanceLoading = type === 'btc' ? btcBalLoading : xmrLoading;
    const isCopied = type === 'btc' ? copiedStates.btc : copiedStates.xmr;

    return (
      <Card >
        <div className="flex flex-col md:flex-row p-4">
          <div className="flex flex-col mb-4 md:mb-0">
            <div className="bg-white rounded-lg border">
              <QRCodeSVG
                className='w-full'
                ref={qrRef}
                value={getQrValue(type)}
                size={200}
                level="H"
              />
            </div>
            <Button
              onClick={() => downloadQR(type === 'btc' ? 'btc' : 'monero', qrRef)}
              className="mt-4"
              variant="default"
            >
              <Download size={16} className="mr-2" /> Download QR Code
            </Button>
          </div>
          <CardContent className="pt-3 w-full">
            <CardHeader className="flex flex-row p-0 justify-between pb-2">
              <CardTitle className="text-xl flex">
                <img src={logoSrc} alt={`${title} logo`} className="w-6 h-6 rounded-full mr-2" />
                {title}
              </CardTitle>
              <Badge variant="outline" className={badgeColor}>{badgeText}</Badge>
            </CardHeader>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Spot Balance</span>
                <span className="font-bold">
                  {isSpotLoading ? <p className='bg-gray-300 h-4 w-10 animate-pulse rounded'></p> : `${Number(spotBalance).toFixed(4)} ${badgeText}`}
                </span>
              </div>

              {
                type == "xmr" &&
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Unlocked Balance (Amount you can spend)</span>
                  <span className="font-bold">
                    {isBalanceLoading ? <p className='bg-gray-300 h-4 w-10 animate-pulse rounded'></p> : `${Number(unlockedBalanced).toFixed(4)} ${badgeText}`}
                  </span>
                </div>
              }

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{type == "xmr" ? "Total Funding Balance" : "Funding Balance"} </span>
                <span className="font-bold">
                  {isBalanceLoading ? <p className='bg-gray-300 h-4 w-10 animate-pulse rounded'></p> : `${Number(fundingBalance).toFixed(4)} ${badgeText}`}
                </span>
              </div>
              <div >
                <p className="text-sm text-muted-foreground mb-3">Funding Address</p>
                <div className="flex items-center w-full sm:w-1/2">
                  <div
                    className="bg-muted p-3 rounded text-sm overflow-hidden text-ellipsis flex-1"
                    title={walletAddress || ""}
                  >
                    <p className="text-xs font-mono">{isAddressLoading ? "Loading..." : (walletAddress && walletAddress.length > 30) ? `${walletAddress.slice(0, 40)}...` : walletAddress || ""}</p>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2"
                          onClick={() => copyToClipboard(walletAddress || "", type)}
                        >
                          {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isCopied ? "Copied!" : "Copy to clipboard"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-5">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Wallet Overview</h1>
      <div className="grid grid-cols-1 gap-8">
        {/* Bitcoin Wallet Card */}
        <WalletCard
          type="btc"
          title="Bitcoin Wallet"
          logoSrc="/btc.png"
          badgeText="BTC"
          badgeColor="text-amber-500 border-amber-500"
          spotBalance={bitcoinSpotData?.currentamount}
          fundingBalance={btcBalData?.balance}
          walletAddress={bitcoinData?.wallet_address}
          isLoading={btcLoading}
          qrRef={btcQrRef}
        />

        {/* Monero Wallet Card */}
        <WalletCard
          type="xmr"
          title="Monero Wallet"
          logoSrc="/monero.png"
          badgeText="XMR"
          badgeColor="text-orange-500 border-orange-500"
          spotBalance={xmrSpotBalData?.balance}
          fundingBalance={moneroData?.live_balance}
          unlockedBalanced={moneroData?.unlocked_balance}
          walletAddress={moneroData?.wallet_address}
          isLoading={xmrLoading}
          qrRef={xmrQrRef}
        />
      </div>
    </div>
  );
}