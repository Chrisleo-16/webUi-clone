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

export default function PrivacyPolicy() {
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
            Privacy Policy
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
              At XMOBIT, we respect your privacy and are committed to protecting
              your personal data. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our
              cryptocurrency trading platform.
            </p>
            <p className="text-gray-600">
              Please read this Privacy Policy carefully. By accessing or using
              our Services, you consent to the collection, use, and storage of
              your information as described in this Privacy Policy.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              2. Information We Collect
            </h2>
            <p className="text-gray-600 mb-4">
              We collect several types of information from and about users of
              our Services, including:
            </p>

            <h3 className="text-lg font-medium mb-2 text-gray-700">
              2.1 Personal Data
            </h3>
            <p className="text-gray-600 mb-4">
              We may collect personal identification information, including but
              not limited to:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Residential address</li>
              <li>Date of birth</li>
              <li>Photographs</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-gray-700">
              2.2 Usage Data
            </h3>
            <p className="text-gray-600 mb-4">
              We may also collect information about how you access and use our
              Services, including:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>Time and date of your visits</li>
              <li>Pages you view and features you use</li>
              <li>Trading activity and transaction history</li>
            </ul>

            <h3 className="text-lg font-medium mb-2 text-gray-700">
              2.3 Cookies and Similar Technologies
            </h3>
            <p className="text-gray-600">
              We use cookies and similar tracking technologies to track activity
              on our Services and hold certain information. Cookies are files
              with a small amount of data that may include an anonymous unique
              identifier.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect about you for various purposes,
              including:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
              <li>To provide and maintain our Services</li>
              <li>To process and complete cryptocurrency transactions</li>
              <li>
                To verify your identity in accordance with KYC (Know Your
                Customer) requirements
              </li>
              <li>
                To communicate with you, including providing customer support
              </li>
              <li>
                To send you updates, security alerts, and administrative
                messages
              </li>
              <li>
                To personalize your experience and deliver content relevant to
                your interests
              </li>
              <li>
                To detect, prevent, and address technical issues, fraudulent
                activities, or illegal actions
              </li>
              <li>To comply with legal obligations</li>
              <li>To analyze usage patterns and improve our Services</li>
            </ul>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-gray-600 mb-4">
              We may share your information in the following situations:
            </p>

            <h3 className="text-lg font-medium mb-2 text-gray-700">
              4.1 Service Providers
            </h3>
            <p className="text-gray-600 mb-4">
              We may share your information with third-party vendors, service
              providers, contractors, or agents who perform services for us or
              on our behalf.
            </p>

            <h3 className="text-lg font-medium mb-2 text-gray-700">
              4.2 Business Transfers
            </h3>
            <p className="text-gray-600 mb-4">
              In the event of a merger, acquisition, or asset sale, your
              personal data may be transferred as a business asset. We will
              notify you before your personal data is transferred and becomes
              subject to a different Privacy Policy.
            </p>

            <h3 className="text-lg font-medium mb-2 text-gray-700">
              4.3 With Your Consent
            </h3>
            <p className="text-gray-600">
              We may disclose your personal information for any other purpose
              with your consent.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              5. Data Security
            </h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational measures to
              protect the security of your personal information. However, please
              note that no method of transmission over the Internet or
              electronic storage is 100% secure.
            </p>
            <p className="text-gray-600">
              We strive to use commercially acceptable means to protect your
              personal data, but we cannot guarantee its absolute security. You
              are responsible for maintaining the secrecy of any password and
              account information.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              6. Your Data Protection Rights
            </h2>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have certain rights regarding
              your personal information:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600 space-y-2">
              <li>
                <strong>Right to Access:</strong> You have the right to request
                copies of your personal data.
              </li>
              <li>
                <strong>Right to Rectification:</strong> You have the right to
                request that we correct any information you believe is
                inaccurate or complete information you believe is incomplete.
              </li>
              <li>
                <strong>Right to Erasure:</strong> You have the right to request
                that we erase your personal data, under certain conditions.
              </li>
              <li>
                <strong>Right to Restrict Processing:</strong> You have the
                right to request that we restrict the processing of your
                personal data, under certain conditions.
              </li>
              <li>
                <strong>Right to Object to Processing:</strong> You have the
                right to object to our processing of your personal data, under
                certain conditions.
              </li>
              <li>
                <strong>Right to Data Portability:</strong> You have the right
                to request that we transfer the data we have collected to
                another organization, or directly to you, under certain
                conditions.
              </li>
            </ul>
            <p className="text-gray-600">
              If you wish to exercise any of these rights, please contact us
              using the information provided in the "Contact Us" section.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              7. Children's Privacy
            </h2>
            <p className="text-gray-600">
              Our Services are not intended for individuals under the age of 18.
              We do not knowingly collect personally identifiable information
              from children under 18. If we discover that a child under 18 has
              provided us with personal information, we will delete such
              information from our servers. If you are a parent or guardian and
              you are aware that your child has provided us with personal
              information, please contact us.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="mb-8 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              8. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-600">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date. You are advised to review
              this Privacy Policy periodically for any changes. Changes to this
              Privacy Policy are effective when they are posted on this page.
            </p>
          </MobitCard>

          <MobitCard isShadow={true} rounded={true} className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              9. Contact Us
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please
              contact us:
            </p>
            <p className="text-gray-600">
              Email: privacy@xmobit.com
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
