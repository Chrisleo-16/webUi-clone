'use client';

import { motion } from "framer-motion";
import { useEffect } from 'react';
import Link from "next/link";
import XmobButton from "@/components/button/xmobitButton";
import xmobcolors from "./styles/xmobcolors";
import XmobImage from "@/components/images/xmobImage";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";
import MobitCard from "@/components/cards/xmobcard";
import WorldMap from "@/components/ui/WorldMap";
import AsSeenOn from "@/components/ui/AsSeenOn";
import XmobInput from "@/components/inputs/xmobitInput";
import { sendEmail } from "@/utils/emailService";
import {
  FaTwitter,
  FaLinkedin,
  FaTelegramPlane,
  FaYoutube,
  FaDiscord,
} from "react-icons/fa";
import { FiMenu } from 'react-icons/fi';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

type BackToTopProps = {};
const BackToTop: React.FC<BackToTopProps> = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 rounded-full bg-green-500 text-white shadow-lg transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } hover:bg-green-600`}
      aria-label="Back to top"
    >
      <i className="bi bi-arrow-up" />
    </button>
  );
};

export default function Home() {
  const router = useRouter();
  const [currency, setCurrency] = useState("BTC");
  // const [isHoveringTrade, setIsHoveringTrade] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    if (
      !formData.email ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.location ||
      !formData.message
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      const result = await sendEmail(formData);
      if (result.success) {
        setSuccessMessage(result.message);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          location: "",
          message: "",
        });
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const handleNavigateLogin = () => {
    router.push("/login");
  };
  const features = [
    { icon: '/profile.svg', title: 'Secure Escrow', desc: "Leverage multisig wallets & time-locked trades to keep funds safe." },
    { icon: '/like-dislike.svg', title: 'Local Payments', desc: "Buy/sell via Mpesa, MTN Mobile Money & more, instantly." },
    { icon: '/star.svg', title: 'Dispute Resolution', desc: "Submit evidence & resolve through our moderation team." },
    { icon: '/music-play.svg', title: 'User Verification', desc: "Multi-tiered KYC to ensure platform integrity & trust." },
  ];
  const asSeenLogos = [
    { src: '/fool.svg', width: 150, height: 75 },
    { src: '/nasdaq.svg', width: 100, height: 75 },
    { src: '/bloomberg.svg', width: 100, height: 75 },
    { src: '/yahoo.svg', width: 100, height: 75 },
    { src: '/cointelegraph.svg', width: 200, height: 75 },
  ];
  const currencies = [
    { code: 'KSH', name: 'Kenya Shilling' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
  ];
    const countries = [
       { name: 'Afghanistan', code: 'AF', flag: '🇦🇫' },
    { name: 'Albania', code: 'AL', flag: '🇦🇱' },
    { name: 'Algeria', code: 'DZ', flag: '🇩🇿' },
    { name: 'Andorra', code: 'AD', flag: '🇦🇩' },
    { name: 'Angola', code: 'AO', flag: '🇦🇴' },
    { name: 'Antigua and Barbuda', code: 'AG', flag: '🇦🇬' },
    { name: 'Argentina', code: 'AR', flag: '🇦🇷' },
    { name: 'Armenia', code: 'AM', flag: '🇦🇲' },
    { name: 'Australia', code: 'AU', flag: '🇦🇺' },
    { name: 'Austria', code: 'AT', flag: '🇦🇹' },
    { name: 'Azerbaijan', code: 'AZ', flag: '🇦🇿' },
    { name: 'Bahamas', code: 'BS', flag: '🇧🇸' },
    { name: 'Bahrain', code: 'BH', flag: '🇧🇭' },
    { name: 'Bangladesh', code: 'BD', flag: '🇧🇩' },
    { name: 'Barbados', code: 'BB', flag: '🇧🇧' },
    { name: 'Belarus', code: 'BY', flag: '🇧🇾' },
    { name: 'Belgium', code: 'BE', flag: '🇧🇪' },
    { name: 'Belize', code: 'BZ', flag: '🇧🇿' },
    { name: 'Benin', code: 'BJ', flag: '🇧🇯' },
    { name: 'Bhutan', code: 'BT', flag: '🇧🇹' },
    { name: 'Bolivia', code: 'BO', flag: '🇧🇴' },
    { name: 'Bosnia and Herzegovina', code: 'BA', flag: '🇧🇦' },
    { name: 'Botswana', code: 'BW', flag: '🇧🇼' },
    { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
    { name: 'Brunei', code: 'BN', flag: '🇧🇳' },
    { name: 'Bulgaria', code: 'BG', flag: '🇧🇬' },
    { name: 'Burkina Faso', code: 'BF', flag: '🇧🇫' },
    { name: 'Burundi', code: 'BI', flag: '🇧🇮' },
    { name: 'Cabo Verde', code: 'CV', flag: '🇨🇻' },
    { name: 'Cambodia', code: 'KH', flag: '🇰🇭' },
    { name: 'Cameroon', code: 'CM', flag: '🇨🇲' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦' },
    { name: 'Central African Republic', code: 'CF', flag: '🇨🇫' },
    { name: 'Chad', code: 'TD', flag: '🇹🇩' },
    { name: 'Chile', code: 'CL', flag: '🇨🇱' },
    { name: 'China', code: 'CN', flag: '🇨🇳' },
    { name: 'Colombia', code: 'CO', flag: '🇨🇴' },
    { name: 'Comoros', code: 'KM', flag: '🇰🇲' },
    { name: 'Congo (Congo-Brazzaville)', code: 'CG', flag: '🇨🇬' },
    { name: 'Costa Rica', code: 'CR', flag: '🇨🇷' },
    { name: "Côte d'Ivoire", code: 'CI', flag: '🇨🇮' },
    { name: 'Croatia', code: 'HR', flag: '🇭🇷' },
    { name: 'Cuba', code: 'CU', flag: '🇨🇺' },
    { name: 'Cyprus', code: 'CY', flag: '🇨🇾' },
    { name: 'Czechia', code: 'CZ', flag: '🇨🇿' },
    { name: 'DR Congo', code: 'CD', flag: '🇨🇩' },
    { name: 'Denmark', code: 'DK', flag: '🇩🇰' },
    { name: 'Djibouti', code: 'DJ', flag: '🇩🇯' },
    { name: 'Dominica', code: 'DM', flag: '🇩🇲' },
    { name: 'Dominican Republic', code: 'DO', flag: '🇩🇴' },
    { name: 'Ecuador', code: 'EC', flag: '🇪🇨' },
    { name: 'Egypt', code: 'EG', flag: '🇪🇬' },
    { name: 'El Salvador', code: 'SV', flag: '🇸🇻' },
    { name: 'Equatorial Guinea', code: 'GQ', flag: '🇬🇶' },
    { name: 'Eritrea', code: 'ER', flag: '🇪🇷' },
    { name: 'Estonia', code: 'EE', flag: '🇪🇪' },
    { name: 'Eswatini', code: 'SZ', flag: '🇸🇿' },
    { name: 'Ethiopia', code: 'ET', flag: '🇪🇹' },
    { name: 'Fiji', code: 'FJ', flag: '🇫🇯' },
    { name: 'Finland', code: 'FI', flag: '🇫🇮' },
    { name: 'France', code: 'FR', flag: '🇫🇷' },
    { name: 'Gabon', code: 'GA', flag: '🇬🇦' },
    { name: 'Gambia', code: 'GM', flag: '🇬🇲' },
    { name: 'Georgia', code: 'GE', flag: '🇬🇪' },
    { name: 'Germany', code: 'DE', flag: '🇩🇪' },
    { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
    { name: 'Greece', code: 'GR', flag: '🇬🇷' },
    { name: 'Grenada', code: 'GD', flag: '🇬🇩' },
    { name: 'Guatemala', code: 'GT', flag: '🇬🇹' },
    { name: 'Guinea', code: 'GN', flag: '🇬🇳' },
    { name: 'Guinea-Bissau', code: 'GW', flag: '🇬🇼' },
    { name: 'Guyana', code: 'GY', flag: '🇬🇾' },
    { name: 'Haiti', code: 'HT', flag: '🇭🇹' },
    { name: 'Honduras', code: 'HN', flag: '🇭🇳' },
    { name: 'Hungary', code: 'HU', flag: '🇭🇺' },
    { name: 'Iceland', code: 'IS', flag: '🇮🇸' },
    { name: 'India', code: 'IN', flag: '🇮🇳' },
    { name: 'Indonesia', code: 'ID', flag: '🇮🇩' },
    { name: 'Iran', code: 'IR', flag: '🇮🇷' },
    { name: 'Iraq', code: 'IQ', flag: '🇮🇶' },
    { name: 'Ireland', code: 'IE', flag: '🇮🇪' },
    { name: 'Israel', code: 'IL', flag: '🇮🇱' },
    { name: 'Italy', code: 'IT', flag: '🇮🇹' },
    { name: 'Jamaica', code: 'JM', flag: '🇯🇲' },
    { name: 'Japan', code: 'JP', flag: '🇯🇵' },
    { name: 'Jordan', code: 'JO', flag: '🇯🇴' },
    { name: 'Kazakhstan', code: 'KZ', flag: '🇰🇿' },
    { name: 'Kenya', code: 'KE', flag: '🇰🇪' },
    { name: 'Kiribati', code: 'KI', flag: '🇰🇮' },
    { name: 'Kosovo', code: 'XK', flag: '🇽🇰' },
    { name: 'Kuwait', code: 'KW', flag: '🇰🇼' },
    { name: 'Kyrgyzstan', code: 'KG', flag: '🇰🇬' },
    { name: 'Laos', code: 'LA', flag: '🇱🇦' },
    { name: 'Latvia', code: 'LV', flag: '🇱🇻' },
    { name: 'Lebanon', code: 'LB', flag: '🇱🇧' },
    { name: 'Lesotho', code: 'LS', flag: '🇱🇸' },
    { name: 'Liberia', code: 'LR', flag: '🇱🇷' },
    { name: 'Libya', code: 'LY', flag: '🇱🇾' },
    { name: 'Liechtenstein', code: 'LI', flag: '🇱🇮' },
    { name: 'Lithuania', code: 'LT', flag: '🇱🇹' },
    { name: 'Luxembourg', code: 'LU', flag: '🇱🇺' },
    { name: 'Madagascar', code: 'MG', flag: '🇲🇬' },
    { name: 'Malawi', code: 'MW', flag: '🇲🇼' },
    { name: 'Malaysia', code: 'MY', flag: '🇲🇾' },
    { name: 'Maldives', code: 'MV', flag: '🇲🇻' },
    { name: 'Mali', code: 'ML', flag: '🇲🇱' },
    { name: 'Malta', code: 'MT', flag: '🇲🇹' },
    { name: 'Marshall Islands', code: 'MH', flag: '🇲🇭' },
    { name: 'Mauritania', code: 'MR', flag: '🇲🇷' },
    { name: 'Mauritius', code: 'MU', flag: '🇲🇺' },
    { name: 'Mexico', code: 'MX', flag: '🇲🇽' },
    { name: 'Micronesia', code: 'FM', flag: '🇫🇲' },
    { name: 'Moldova', code: 'MD', flag: '🇲🇩' },
    { name: 'Monaco', code: 'MC', flag: '🇲🇨' },
    { name: 'Mongolia', code: 'MN', flag: '🇲🇳' },
    { name: 'Montenegro', code: 'ME', flag: '🇲🇪' },
    { name: 'Morocco', code: 'MA', flag: '🇲🇦' },
    { name: 'Mozambique', code: 'MZ', flag: '🇲🇿' },
    { name: 'Myanmar', code: 'MM', flag: '🇲🇲' },
    { code: 'NA', name: 'Namibia', flag: '🇳🇦' },
    { code: 'NR', name: 'Nauru', flag: '🇳🇷' },
    { code: 'NP', name: 'Nepal', flag: '🇳🇵' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
    { code: 'NI', name: 'Nicaragua', flag: '🇳🇮' },
    { code: 'NE', name: 'Niger', flag: '🇳🇪' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'MK', name: 'North Macedonia', flag: '🇲🇰' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴' },
    { code: 'OM', name: 'Oman', flag: '🇴🇲' },
    { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
    { code: 'PW', name: 'Palau', flag: '🇵🇼' },
    { code: 'PA', name: 'Panama', flag: '🇵🇦' },
    { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬' },
    { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
    { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
    { code: 'RO', name: 'Romania', flag: '🇷🇴' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺' },
    { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
    { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
    { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
    { code: 'WS', name: 'Samoa', flag: '🇼🇸' },
    { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
    { code: 'ST', name: 'Sao Tome and Principe', flag: '🇸🇹' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'SN', name: 'Senegal', flag: '🇸🇳' },
    { code: 'RS', name: 'Serbia', flag: '🇷🇸' },
    { code: 'SC', name: 'Seychelles', flag: '🇸🇨' },
    { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
    { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
    { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧' },
    { code: 'SO', name: 'Somalia', flag: '🇸🇴' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'SS', name: 'South Sudan', flag: '🇸🇸' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
    { code: 'SD', name: 'Sudan', flag: '🇸🇩' },
    { code: 'SR', name: 'Suriname', flag: '🇸🇷' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
    { code: 'SY', name: 'Syria', flag: '🇸🇾' },
    { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
    { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯' },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
    { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱' },
    { code: 'TG', name: 'Togo', flag: '🇹🇬' },
    { code: 'TO', name: 'Tonga', flag: '🇹🇴' },
    { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹' },
    { code: 'TN', name: 'Tunisia', flag: '🇹🇳' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
    { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲' },
    { code: 'TV', name: 'Tuvalu', flag: '🇹🇻' },
    { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
    { code: 'UA', name: 'Ukraine', flag: '🇺🇦' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
    { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿' },
    { code: 'VU', name: 'Vanuatu', flag: '🇻🇺' },
    { code: 'VA', name: 'Vatican City', flag: '🇻🇦' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
    { code: 'YE', name: 'Yemen', flag: '🇾🇪' },
    { code: 'ZM', name: 'Zambia', flag: '🇿🇲' },
    { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼' },
  ];
  return (
    <div className="min-h-screen bg-white scroll-smooth">
      <motion.header as='header'
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 shadow-lg z-50 m-2 rounded-pill animate__animated animate__fadeInDown"
    >
      <div className="container-fluid  d-flex justify-content-between align-items-center p-3">
        {/* Logo */}
        <div className="d-flex align-items-center gap-3">
          <Link href="/" className="d-flex align-items-center gap-2 text-decoration-none">
              <XmobImage
                src="/xmobit.png"
                alt="Xmobit Logo"
                circular
                width="40px"
                height="40px"
                className="rounded-circle border border-warning"
              />
              <span className="fs-4 fw-bold text-dark">Xmobit</span>
          </Link>
        </div>

        {/* Buy/Sell CTA */}
        <Link href='/signup' className="text-decoration-none">
          <button className="buttos">
          <div className='default-btn'>
            <span>Buy & Sell Crypto</span>
          </div>
          <div className="hover-btn text-white px-4">
            Get Started
          </div>
          </button>
        </Link>


        {/* Mobile Menu Button
        <button
          className="btn btn-outline-warning d-md-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className="bi bi-list fs-4"></i>
        </button>**/}
      </div>

      {/* Mobile Menu */}
      {/* {isMenuOpen && (
        <div className="bg-white py-3 px-4 shadow-lg d-md-none animate__animated animate__fadeIn">
          <Link href="/signup" className="d-block py-2 text-dark fw-bold text-decoration-none">
              Buy/Sell Crypto
          </Link>
        </div>
      )} */} 
    </motion.header>

      {/* Hero Section - Add fade in and slide effects */}
      {/* Hero Section */}
      <motion.div as='section'
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="pt-24 px-4 md:px-6 bg-gradient-to-r from-white to-yellow-50"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 py-16">
          <motion.div as='section' variants={fadeInUp} className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Easy, <span className="text-green-500">Secure</span> &{' '}
              <span className="text-green-500">Fast</span> Crypto Trading
            </h1>
            <p className="text-gray-600 text-lg max-w-lg">
              Join thousands across Africa and experience next‑level security & speed in buying Bitcoin and Monero.
            </p>
            <XmobButton
              backgroundColor="#D4AF37"
              color="#1a202c"
              onClick={() => window.location.href = '/signup'}
              className="font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              Get Started
            </XmobButton>
          </motion.div>

          <motion.div as='section'
            variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } } }}
            className="relative flex justify-center items-center flex-1"
          >
            <XmobImage
              src="xmr-3d.svg"
              alt="Monero"
              width="300px"
              height="300px"
              className="relative z-20 shadow-xl rounded-full animate__pulse"
            />
            <XmobImage
              src="btc-3d.svg"
              alt="Bitcoin"
              width="350px"
              height="350px"
              className="absolute -translate-x-16 -translate-y-8 z-10 shadow-lg rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>

    {/* Simplified Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
        className="px-4 md:px-6 py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto text-center mb-12">
          <p className="text-green-600 uppercase tracking-wide">Our Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            Simplifying BTC & XMR Acquisition
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Secure, escrow-backed platform supporting Mpesa, MTN Mobile Money, and more local payment methods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-12">
          {features.map((f, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="flex flex-col items-center bg-white rounded-2xl p-6 shadow-md transition-shadow duration-300">
              <div className="bg-green-50 p-3 rounded-full mb-4">
                <Image src={f.icon} alt={f.title} width={64} height={64} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">{f.title}</h3>
              <p className="text-gray-600 text-center mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Center Illustration Redesigned */}
        <motion.div variants={fadeInUp} className="flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-xl overflow-hidden shadow-xl">
            <XmobImage src="/btc-illustration.svg" alt="Feature Illustration" width="100%" height="100%" className="object-contain" />
          </div>
        </motion.div>
      </motion.section>


      {/* Global Presence Section - Add parallax effect */}
      <motion.div className="relative bg-[#00BF63] text-white">
        <svg
          className="absolute top-0 left-0 w-full"
          viewBox="0 0 1440 50"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C480,0 960,0 1440,50 L1440,0 L0,0 Z"
            fill="white"
          ></path>
        </svg>
         <div className="max-w-5xl w-full flex flex-col md:flex-row items-center text-white mx-auto gap-8 py-24">
          {/* Left Section */}
          <div className="w-full md:w-1/2 space-y-4 sm:space-y-6">
            <h4 className="text-yellow-400 font-semibold text-base sm:text-lg">
              REVOLUTIONIZING CRYPTOCURRENCY TRADING IN AFRICA
            </h4>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-gray-700">
              Xmobit is the number one cryptocurrency marketplace designed to
              empower African traders.
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Our mission is ensuring a safe, secure, and fast platform where
              traders can buy and sell bitcoin conveniently due to its
              integration of local payment methods. We envisage the provision of
              a secure, accessible, and inclusive platform that enables seamless
              crypto trading across the continent.
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">
              32K+{" "}
              <span className="text-base sm:text-lg font-normal">
                People Joined
              </span>
            </p>
          </div>
          {/* Right Section */}
          <div className="w-full md:w-1/2 flex justify-center scale-125 sm:scale-100">
            <WorldMap />
          </div>
        </div>
      </motion.div>

    


   

       <div className="h-16" />
 {/* As Seen On Carousel - Two Rows */}
      <section className="py-12 overflow-hidden">
        <h3 className="text-center font-bold text-3xl mb-6">As seen on</h3>
        <div className="space-y-8">
          {/* First row - slides left */}
          <div className="overflow-hidden">
            <div className="flex items-center space-x-12 animate-scroll-left hover:pause-animation">
              {asSeenLogos.concat(asSeenLogos).map((logo, idx) => (
                <div key={`row1-${idx}`} className="flex-shrink-0">
                  <Image src={logo.src} alt="logo" width={logo.width} height={logo.height} />
                </div>
              ))}
            </div>
          </div>
          {/* Second row - slides right */}
          <div className="overflow-hidden">
            <div className="flex items-center space-x-12 animate-scroll-right hover:pause-animation">
              {asSeenLogos.concat(asSeenLogos).map((logo, idx) => (
                <div key={`row2-${idx}`} className="flex-shrink-0">
                  <Image src={logo.src} alt="logo" width={logo.width} height={logo.height} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animation CSS */}
        <style jsx>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
          }
          .animate-scroll-left {
            animation: scroll-left 20s linear infinite;
          }
          .animate-scroll-right {
            animation: scroll-right 20s linear infinite;
          }
          .pause-animation:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>
      
      {/* Registration Form */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-[#ECFDF5] py-10 sm:py-12 md:py-16 px-4 md:px-6"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          {/* Left Side: Contact Form */}
          <motion.div variants={fadeInUp} className="w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              Looking to{" "}
              <span className="text-green-600">Buy & Sell Crypto</span>?
            </h2>
            <p className="text-gray-600 text-xl sm:text-2xl md:text-3xl font-semibold mt-2">
              Get in touch with us.
            </p>

            <MobitCard
              width="w-full"
              className="mt-6 p-4 sm:p-6"
              isShadow={true}
              rounded={true}
            >
              <form className="space-y-3 sm:space-y-4">
                <Xmoblayout
                  layoutType="flex-row"
                  gap="gap-3 sm:gap-4"
                  className="flex-col sm:flex-row"
                >
                  <XmobInput
                    type="text"
                    name="firstName"
                    placeholder="First Name*"
                    className="p-2 sm:p-3 border rounded-lg w-full text-sm"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <XmobInput
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last Name*"
                    className="p-2 sm:p-3 border rounded-lg w-full text-sm"
                  />
                </Xmoblayout>
                <Xmoblayout
                  layoutType="flex-row"
                  gap="gap-3 sm:gap-4"
                  className="flex-col sm:flex-row"
                >
                  <XmobInput
                    type="email"
                    placeholder="Business Email*"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="p-2 sm:p-3 border rounded-lg w-full text-sm"
                  />
                  <div className="px-4 md:px-6 mt-12 max-w-3xl mx-auto">
        <p className="text-gray-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
          Local currency:
        </p>
        <select className="w-full p-3 sm:p-4 rounded-lg border border-gray-200 bg-white hover:border-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
          {currencies.map((c, idx) => (
            <option key={idx} value={c.code}>{`${c.name} (${c.code})`}</option>
          ))}
        </select>
      </div>
                </Xmoblayout>
                <textarea
                  name="message"
                  placeholder="How can we help?"
                  className="p-2 sm:p-3 border rounded-lg w-full text-sm"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    By submitting your email address, you agree to receive
                    occasional marketing messages from XMOBIT, from which you
                    can unsubscribe at any time. For more information please see
                    our
                    <a href="/privacy" className="text-green-600 p-1 sm:p-2">
                      privacy policy.
                    </a>
                  </p>
                  <XmobButton
                    backgroundColor={xmobcolors.primary}
                    color={xmobcolors.light}
                    isFullWidth={true}
                    disabled={loading}
                    onClick={handleSubmit}
                    className="py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg"
                  >
                    {loading ? "Sending..." : "Submit"}
                  </XmobButton>
                </div>
              </form>
              {successMessage && (
                <p className="text-center text-sm" style={{ color: "green" }}>
                  {successMessage}
                </p>
              )}
              {errorMessage && (
                <p className="text-center text-sm" style={{ color: "red" }}>
                  {errorMessage}
                </p>
              )}
            </MobitCard>
          </motion.div>

          {/* Right Side: Crypto Checkout Mockup */}
          <motion.div
            variants={fadeInUp}
            className="flex justify-center w-full"
          >
            <MobitCard
              width="w-full max-w-[360px]"
              className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white to-gray-50"
              isShadow={true}
              rounded={true}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5 sm:mb-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <XmobImage
                    alt=""
                    src="/xmobit.png"
                    width="32px"
                    height="32px"
                    className="w-8 h-8 sm:w-10 sm:h-10"
                  />
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                      Quick Checkout
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Select payment method
                    </p>
                  </div>
                </div>
              </div>

              {/* Crypto Selection */}
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <p className="text-gray-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Select cryptocurrency:
                  </p>
                  <select
  value={currency}
  onChange={(e) => setCurrency(e.target.value)}
  className="border border-gray-300 rounded-lg p-2.5 sm:p-3.5 text-sm bg-white hover:border-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
>
  <option value="BTC">Bitcoin (BTC)</option>
  <option value="XMR">Monero (XMR)</option>
</select>

<XmobInput
  readonly={true}
  endIconSrc={currency === "BTC" ? "/btc.png" : "/xmr.png"}
  className="hover:border-green-500 transition-colors text-sm p-2.5 sm:p-3.5"
  placeholder={currency === "BTC" ? "Bitcoin (BTC)" : "Monero (XMR)"}
/>
                </div>

                {/* Currency Selection */}
                {/* Currency Select Example */}
      <div className="px-4 md:px-6 mt-12 max-w-3xl mx-auto">
        <p className="text-gray-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
          Local currency:
        </p>
        <select className="w-full p-3 sm:p-4 rounded-lg border border-gray-200 bg-white hover:border-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
          {currencies.map((c, idx) => (
            <option key={idx} value={c.code}>{`${c.name} (${c.code})`}</option>
          ))}
        </select>
      </div>

                {/* Amount Input */}
                <div>
                  <p className="text-gray-700 font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Amount:
                  </p>
                  <XmobInput
                    type="number"
                    readonly={true}
                    className="hover:border-green-500 transition-colors text-sm p-2.5 sm:p-3.5"
                    placeholder="0.00"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    ≈ 0.000 BTC
                  </p>
                </div>

                {/* Action Button */}
                <XmobButton
                  backgroundColor={xmobcolors.primary}
                  isFullWidth={true}
                  className="mt-4 sm:mt-6 py-2.5 sm:py-4 text-sm sm:text-lg font-semibold hover:scale-[1.02] transition-transform"
                >
                <Link href='/login'>
                  Continue to Payment
                </Link>
                </XmobButton>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs sm:text-sm text-gray-500">
                  Secure 256-bit SSL and end-end data encryption.
                </span>
              </div>
            </MobitCard>
          </motion.div>
        </div>
      </motion.section>
      <BackToTop />

       <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-white text-gray-700 py-6 sm:py-8 border-t px-4 md:px-6 mt-12"
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between gap-6 sm:gap-8">
            {/* Logo & Social */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold">
                <span className="text-green-500">X</span>
                <span className="text-yellow-500">MOBIT</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm font-semibold text-gray-500">
                Be part of our community
              </p>
              <div className="flex justify-center md:justify-start space-x-4 mt-4">
                {[
                  { icon: 'bi-twitter', color: 'text-blue-500' },
                  { icon: 'bi-linkedin', color: 'text-blue-700' },
                  { icon: 'bi-telegram', color: 'text-blue-400' },
                  { icon: 'bi-youtube', color: 'text-red-500' },
                  { icon: 'bi-discord', color: 'text-indigo-500' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`${s.color} p-2 border border-gray-300 rounded-full hover:bg-yellow-400 hover:text-white transition-all duration-300`}
                  >
                    <i className={`bi ${s.icon} text-xl`} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center md:text-left text-sm">
              {[
                { title: 'For You', links: ['Buy Bitcoin','Buy Monero','Sell Bitcoin','Sell Monero'] },
                { title: 'Get to Know Us', links: ['About Us','Xmobit Blog','Xmobit Telegram','Contact Us'] },
                { title: 'Useful', links: ['Terms & Conditions','Privacy Policy','FAQ'] },
              ].map((col, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold text-gray-800 mb-2 uppercase tracking-wide">
                    {col.title}
                  </h3>
                  <ul className="space-y-1">
                    {col.links.map((link, j) => (
                      <li key={j}>
                        <Link href="#" className="text-gray-600 hover:text-yellow-500 hover:underline transition-colors duration-300">
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
            <p>&copy; {new Date().getFullYear()} Xmobit. All rights reserved.</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
