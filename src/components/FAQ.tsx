import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqData = [
  {
    id: "faq-1",
    question: "What should I do after I have received payment?",
    answer:
      "Once you've confirmed the payment has been received in your account, you should release the coins to the buyer. This can be done by clicking the 'Release Coins' button in the payment tab. Always verify the payment has actually arrived in your account before releasing funds.",
  },
  {
    id: "faq-2",
    question: "What should I do if the other party did not make payment?",
    answer:
      "If the buyer hasn't made payment within the time limit, the trade will be automatically cancelled. If they marked payment as sent but you haven't received it, you can appeal the trade after the appeal countdown expires. Provide clear evidence when submitting your appeal.",
  },
  {
    id: "faq-3",
    question: "How long do I have to complete the trade?",
    answer:
      "The trade will be automatically cancelled if payment isn't marked as sent within 15 minutes of trade initiation. After payment is marked as sent, the seller has a reasonable time to verify and release the coins.",
  },
  {
    id: "faq-4",
    question: "How do I appeal a trade?",
    answer:
      "If there's an issue with the trade that can't be resolved between parties, you can appeal by clicking the 'Appeal Trade' button after the countdown expires. Provide a detailed explanation of the issue. An admin will review your case and make a decision.",
  },
  {
    id: "faq-5",
    question: "Is my payment information secure?",
    answer:
      "Your payment details are only shared within the trade chat. We recommend only sharing the minimum necessary information required to complete the transaction. Never share your passwords or authentication codes.",
  },
];

const FAQAccordion = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">
          Frequently Asked Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-sm font-medium hover:text-blue-600 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground px-2 pt-1 pb-3">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FAQAccordion;
