"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import XmobImage from "@/components/images/xmobImage";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";
import MobitCard from "@/components/cards/xmobcard";
import XmobButton from "@/components/button/xmobitButton";
import xmobcolors from "../styles/xmobcolors";
import XmobInput from "@/components/inputs/xmobitInput";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// FAQ data structure
const faqCategories = [
  {
    id: "getting-started",
    name: "Getting Started",
    faqs: [
      {
        question: "What is XMOBIT?",
        answer:
          "XMOBIT is a cryptocurrency exchange platform designed specifically for African traders. We provide a secure, accessible, and inclusive platform that enables seamless cryptocurrency trading across the continent, with a focus on Bitcoin and Monero.",
      },
      {
        question: "How do I create an account?",
        answer:
          "To create an account, click on the 'Get Started' or 'Sign Up' button on our homepage. You'll need to provide your email address, create a password, and complete our verification process which may include providing identification documents to comply with KYC regulations.",
      },
      {
        question: "Is XMOBIT available in my country?",
        answer:
          "XMOBIT is primarily focused on serving African traders. We currently operate in several African countries including Nigeria, Kenya, Cameroon, and others. We're continuously expanding our service area. Check our 'Countries' page for the most up-to-date list of supported countries.",
      },
      {
        question: "Do I need to verify my identity?",
        answer:
          "No. At the moment we do not require identity verification to create an account and start trading. However, we recommend verifying your identity to unlock higher transaction limits and access additional features on our platform.",
      },
    ],
  },
  {
    id: "trading",
    name: "Trading & Transactions",
    faqs: [
      {
        question: "How do I buy Bitcoin or Monero?",
        answer:
          "To buy cryptocurrency on XMOBIT, log into your account, click on 'Buy/Sell' in the navigation menu, select the cryptocurrency you want to purchase (Bitcoin or Monero), enter the amount, choose your payment method, and follow the prompts to complete your purchase.",
      },
      {
        question: "What payment methods are supported?",
        answer:
          "XMOBIT supports various local payment methods across Africa, including mobile money services (like M-Pesa), bank transfers, and online payment platforms. Available payment methods vary by country. When you're making a transaction, you'll see the payment options available in your location.",
      },
      {
        question: "How long do transactions take?",
        answer:
          "Transaction times vary depending on the payment method, network conditions, and confirmation requirements. Generally, deposits via mobile money are credited within minutes, while bank transfers may take 1-3 business days. Cryptocurrency withdrawals typically complete within 10-60 minutes depending on network congestion.",
      },
      {
        question: "Are there any transaction limits?",
        answer:
          "Yes, transaction limits depend on your verification level and account history. New users typically start with lower limits that increase as they complete higher verification levels and establish a transaction history on our platform. You can view your current limits in your account settings.",
      },
      {
        question: "How does the escrow service work?",
        answer:
          "Our escrow service holds the seller's cryptocurrency in a secure escrow wallet while the buyer completes their payment. Once the payment is confirmed, the cryptocurrency is released to the buyer. This protects both parties during the transaction and reduces the risk of fraud.",
      },
    ],
  },
  {
    id: "security",
    name: "Security & Privacy",
    faqs: [
      {
        question: "How does XMOBIT keep my assets secure?",
        answer:
          "XMOBIT employs several layers of security including cold storage for the majority of cryptocurrencies, multi-signature wallets, two-factor authentication (2FA), and regular security audits. We also have a dedicated security team monitoring our systems 24/7.",
      },
      {
        question:
          "What should I do if I suspect unauthorized access to my account?",
        answer:
          "If you suspect unauthorized access, immediately change your password, enable two-factor authentication if not already active, and contact our support team. We recommend also checking your recent transaction history and ensuring your email account is secure.",
      },
      {
        question: "How can I enable two-factor authentication (2FA)?",
        answer:
          "To enable 2FA, log into your account, go to 'Settings' > 'Security', and select 'Enable Two-Factor Authentication'. You can choose between app-based authentication (like Google Authenticator) or SMS verification. We strongly recommend using app-based authentication for enhanced security.",
      },
      {
        question: "How does XMOBIT handle my personal data?",
        answer:
          "XMOBIT adheres to strict data protection standards. We collect only the information necessary to provide our services and comply with regulations. Your personal data is encrypted, stored securely, and never shared with unauthorized third parties. For more details, please review our Privacy Policy.",
      },
    ],
  },
  {
    id: "account",
    name: "Account Management",
    faqs: [
      {
        question: "How do I reset my password?",
        answer:
          "To reset your password, click 'Forgot Password' on the login page, enter your registered email address, and follow the instructions sent to your email. For security reasons, password reset links expire after 30 minutes.",
      },
      {
        question: "Can I have multiple XMOBIT accounts?",
        answer:
          "No, each user is permitted only one XMOBIT account. Creating multiple accounts violates our Terms of Service and may result in account suspension or closure. If you need additional features or higher limits, please contact our support team.",
      },
      {
        question: "How do I close my account?",
        answer:
          "To close your account, please ensure you've withdrawn all funds first. Then, go to 'Settings' > 'Account', and select 'Close Account'. You'll need to confirm this action and may be asked to provide a reason. Note that account closure is permanent and cannot be reversed.",
      },
      {
        question:
          "What happens if I lose access to my two-factor authentication device?",
        answer:
          "If you lose access to your 2FA device, you'll need to contact our support team and complete an identity verification process to regain access to your account. This process may take 1-3 business days, so we strongly recommend saving your 2FA backup codes in a secure location.",
      },
    ],
  },
];

export default function HelpCenter() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState("getting-started");
  const [expandedFaqs, setExpandedFaqs] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    success: false,
    error: false,
    message: "",
  });

  // Handle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? "" : categoryId);
  };

  // Handle FAQ item expansion
  const toggleFaq = (faqIndex: string) => {
    setExpandedFaqs({
      ...expandedFaqs,
      [faqIndex]: !expandedFaqs[faqIndex],
    });
  };

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery
    ? faqCategories
        .map((category) => ({
          ...category,
          faqs: category.faqs.filter(
            (faq) =>
              faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((category) => category.faqs.length > 0)
    : faqCategories;

  // Handle contact form changes
  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle contact form submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setFormStatus({
        success: false,
        error: true,
        message: "Please fill in all fields",
      });
      return;
    }

    // Simulate form submission - in a real app, you'd send this to your backend
    setFormStatus({
      success: true,
      error: false,
      message: "Your message has been sent. We'll get back to you soon!",
    });

    // Reset form
    setContactForm({ name: "", email: "", message: "" });

    // In a real implementation, you would send the form data to your backend here
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-8">
          <Link href="/">
            <XmobImage src="/xmobit.png" alt="Xmobit Logo" circular={true} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-bold"
            >
              Home
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="pt-28 md:pt-36 px-4 md:px-8 max-w-6xl mx-auto"
      >
        <motion.div variants={fadeInUp} className="text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">
            How can we help you?
          </h1>
          <p className="text-gray-600 text-lg mx-auto max-w-2xl mb-8">
            Find answers to common questions and learn more about using XMOBIT's
            cryptocurrency trading platform.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-16">
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FiSearch size={20} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="px-4 md:px-8 max-w-6xl mx-auto mb-20"
      >
        <motion.div variants={fadeInUp}>
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
            Frequently Asked Questions
          </h2>

          {searchQuery && filteredFaqs.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No results found for "{searchQuery}"
              </p>
              <XmobButton
                backgroundColor={xmobcolors.primary}
                color={xmobcolors.light}
                onClick={() => setSearchQuery("")}
                className="mt-4"
              >
                Clear Search
              </XmobButton>
            </div>
          )}

          {/* FAQ Categories and Questions */}
          <div className="space-y-6">
            {filteredFaqs.map((category) => (
              <MobitCard
                key={category.id}
                isShadow={true}
                rounded={true}
                className="overflow-hidden"
              >
                {/* Category Header */}
                <div
                  className={`flex justify-between items-center p-6 cursor-pointer ${
                    expandedCategory === category.id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {category.name}
                  </h3>
                  <div>
                    {expandedCategory === category.id ? (
                      <FiChevronUp size={24} className="text-gray-600" />
                    ) : (
                      <FiChevronDown size={24} className="text-gray-600" />
                    )}
                  </div>
                </div>

                {/* FAQ Items */}
                {expandedCategory === category.id && (
                  <div className="border-t">
                    {category.faqs.map((faq, index) => {
                      const faqKey = `${category.id}-${index}`;
                      return (
                        <div key={faqKey} className="border-b last:border-b-0">
                          <div
                            className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleFaq(faqKey)}
                          >
                            <h4 className="text-lg font-medium text-gray-700 pr-8">
                              {faq.question}
                            </h4>
                            <div>
                              {expandedFaqs[faqKey] ? (
                                <FiChevronUp
                                  size={20}
                                  className="text-gray-500"
                                />
                              ) : (
                                <FiChevronDown
                                  size={20}
                                  className="text-gray-500"
                                />
                              )}
                            </div>
                          </div>

                          {expandedFaqs[faqKey] && (
                            <div className="px-6 pb-6 text-gray-600">
                              <p>{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </MobitCard>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Contact Support Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-gray-50 py-16 px-4 md:px-8"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
              Still need help?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is ready to
              assist you with any questions or issues you may have.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Contact Form */}
            <motion.div variants={fadeInUp}>
              <MobitCard isShadow={true} rounded={true} className="p-6">
                <form onSubmit={handleContactSubmit}>
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">
                    Send us a message
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-gray-700 mb-2"
                      >
                        Your Name
                      </label>
                      <XmobInput
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        placeholder="Enter your full name"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <XmobInput
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        placeholder="Enter your email address"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-gray-700 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        placeholder="How can we help you?"
                        rows={5}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      ></textarea>
                    </div>

                    {formStatus.message && (
                      <div
                        className={`p-3 rounded-lg ${
                          formStatus.success
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {formStatus.message}
                      </div>
                    )}

                    <XmobButton
                      onClick={handleContactSubmit}
                      backgroundColor={xmobcolors.primary}
                      color={xmobcolors.light}
                      isFullWidth={true}
                      className="py-3"
                    >
                      Send Message
                    </XmobButton>
                  </div>
                </form>
              </MobitCard>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={fadeInUp}>
              <MobitCard isShadow={true} rounded={true} className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                  Other ways to reach us
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Email Support
                    </h4>
                    <p className="text-gray-600">
                      For general inquiries:{" "}
                      <a
                        href="mailto:support@xmobit.com"
                        className="text-green-600 hover:underline"
                      >
                        support@xmobit.com
                      </a>
                    </p>
                    <p className="text-gray-600">
                      For account issues:{" "}
                      <a
                        href="mailto:accounts@xmobit.com"
                        className="text-green-600 hover:underline"
                      >
                        accounts@xmobit.com
                      </a>
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Social Media
                    </h4>
                    <p className="text-gray-600">
                      Connect with us on social media for the latest updates and
                      faster responses.
                    </p>
                    <div className="flex space-x-4 mt-3">
                      <a href="#" className="text-gray-600 hover:text-blue-500">
                        Twitter
                      </a>
                      <a href="#" className="text-gray-600 hover:text-blue-600">
                        Telegram
                      </a>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-indigo-500"
                      >
                        Discord
                      </a>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">
                      Business Hours
                    </h4>
                    <p className="text-gray-600">
                      Our support team is available Monday through Friday, 9 AM
                      to 6 PM (EAT).
                    </p>
                    <p className="text-gray-600">
                      Emergency support is available 24/7 for account security
                      issues.
                    </p>
                  </div>
                </div>
              </MobitCard>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-white text-gray-700 py-8 border-t px-4 md:px-6">
        <div className="container mx-auto text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} All rights reserved to Xmobit.
          </p>
          <div className="mt-4 space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/help" className="text-gray-600 hover:text-gray-900">
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
