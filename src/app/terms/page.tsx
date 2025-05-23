"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import XmobImage from "@/components/images/xmobImage";
import Xmoblayout from "@/components/layouts/xmoblayout";
import XmobitSpacer from "@/components/layouts/xmobitSpacer";
import MobitCard from "@/components/cards/xmobcard";
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

export default function TermsAndConditions() {
  const router = useRouter();

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

      {/* Main Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="pt-24 md:pt-32 px-4 md:px-8 max-w-6xl mx-auto pb-20"
      >
        <motion.div variants={fadeInUp}>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Terms and Conditions
          </h1>
          <p className="text-gray-600 mb-8">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              1. Introduction
            </h2>
            <p className="text-gray-600 mb-4">
              Welcome to XMOBIT, a cryptocurrency exchange platform designed for
              African traders. By accessing or using our services, you agree to
              be bound by these Terms and Conditions. Please read them carefully
              before proceeding.
            </p>
            <p className="text-gray-600">
              These Terms constitute a legally binding agreement between you and
              XMOBIT governing your access to and use of the website, services,
              and applications (collectively, the "Services").
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              2. Eligibility
            </h2>
            <p className="text-gray-600 mb-4">
              To be eligible to use XMOBIT Services, you must be at least 18
              years old and able to form legally binding contracts. By using our
              Services, you represent and warrant that you meet all eligibility
              requirements.
            </p>
            <p className="text-gray-600">
              XMOBIT may not be available in all jurisdictions. You are
              responsible for complying with all applicable local laws in your
              jurisdiction before using our Services.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              3. Account Registration and Security
            </h2>
            <p className="text-gray-600 mb-4">
              To access certain features of the Services, you must register for
              an account. You agree to provide accurate, current, and complete
              information during the registration process and to update such
              information to keep it accurate and complete.
            </p>
            <p className="text-gray-600 mb-4">
              You are responsible for maintaining the confidentiality of your
              account credentials, including your password, and for all
              activities that occur under your account. You agree to notify
              XMOBIT immediately of any unauthorized use of your account.
            </p>
            <p className="text-gray-600">
              XMOBIT reserves the right to suspend or terminate accounts that
              violate these Terms or engage in suspicious activities.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              4. Trading Rules and Escrow Service
            </h2>
            <p className="text-gray-600 mb-4">
              Our platform provides an escrow service for cryptocurrency
              trading. By using our trading service, you agree to the following
              rules:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
              <li>
                The buyer must make payment within the agreed-upon timeframe.
              </li>
              <li>
                The seller must release the cryptocurrency upon confirmation of
                payment.
              </li>
              <li>
                All disputes will be handled according to our dispute resolution
                process.
              </li>
              <li>
                XMOBIT may charge fees for trading services, which will be
                clearly disclosed before each transaction.
              </li>
            </ul>
            <p className="text-gray-600">
              XMOBIT reserves the right to freeze assets in escrow during
              disputes or investigations of suspicious activity.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              5. Prohibited Activities
            </h2>
            <p className="text-gray-600 mb-4">
              When using XMOBIT Services, you agree not to:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
              <li>Violate any laws, regulations, or third-party rights.</li>
              <li>
                Use the Services for any illegal activities, including money
                laundering or financing terrorism.
              </li>
              <li>Provide false, inaccurate, or misleading information.</li>
              <li>
                Attempt to gain unauthorized access to other users' accounts or
                XMOBIT systems.
              </li>
              <li>Engage in manipulative trading practices.</li>
              <li>
                Use the Services to transmit harmful code or conduct
                denial-of-service attacks.
              </li>
            </ul>
            <p className="text-gray-600">
              Violation of these prohibitions may result in account termination
              and potential legal action.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              6. Fees and Payments
            </h2>
            <p className="text-gray-600 mb-4">
              XMOBIT charges fees for various services provided on the platform.
              All applicable fees will be clearly displayed before you complete
              any transaction.
            </p>
            <p className="text-gray-600 mb-4">
              Fee schedules are subject to change, and XMOBIT will provide
              notice of any fee changes through the platform.
            </p>
            <p className="text-gray-600">
              You are responsible for all taxes applicable to your trading
              activities.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              7. Limitation of Liability
            </h2>
            <p className="text-gray-600 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, XMOBIT SHALL NOT BE LIABLE
              FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, OR
              USE, ARISING OUT OF OR IN CONNECTION WITH THE SERVICES.
            </p>
            <p className="text-gray-600">
              XMOBIT's total liability to you for any claim arising from or
              relating to these Terms or the Services shall not exceed the
              amount paid by you to XMOBIT during the six (6) months prior to
              such claim.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              8. Modifications to Terms
            </h2>
            <p className="text-gray-600 mb-4">
              XMOBIT reserves the right, at its sole discretion, to modify or
              replace these Terms at any time. If a revision is material, we
              will provide at least 30 days' notice prior to any new terms
              taking effect.
            </p>
            <p className="text-gray-600">
              Your continued use of the Services after the changes become
              effective constitutes your acceptance of the revised Terms.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              9. Governing Law
            </h2>
            <p className="text-gray-600 mb-4">
              These Terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which XMOBIT is registered,
              without regard to its conflict of law provisions.
            </p>
            <p className="text-gray-600">
              Any disputes arising under these Terms shall be resolved through
              arbitration in accordance with the rules of the applicable
              arbitration association.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              10. Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-600">
              Email: support@xmobit.com
              <br />
              Address: XMOBIT Headquarters, Nairobi, Kenya
            </p>
          </MobitCard>
        </motion.div>
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
