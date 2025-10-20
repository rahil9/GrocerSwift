"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// FAQ data
const faqCategories = [
  {
    id: "ordering",
    name: "Ordering & Delivery",
    faqs: [
      {
        question: "How quickly can I receive my order?",
        answer:
          "We deliver most orders within 10-30 minutes, depending on your location and the time of day. You can see the estimated delivery time before placing your order.",
      },
      {
        question: "What are your delivery hours?",
        answer: "We deliver from 8:00 AM to 11:00 PM, seven days a week, including holidays.",
      },
      {
        question: "Is there a minimum order value?",
        answer:
          "No, there is no minimum order value. However, orders below ₹200 will incur a small delivery fee of ₹30.",
      },
      {
        question: "How do I track my order?",
        answer:
          "Once your order is confirmed, you can track it in real-time through the 'Orders' section in your account. You'll also receive SMS updates about your order status.",
      },
    ],
  },
  {
    id: "products",
    name: "Products & Pricing",
    faqs: [
      {
        question: "Are your products fresh?",
        answer:
          "Yes, we source our products directly from farms and reputable suppliers. All perishable items are checked for freshness before delivery.",
      },
      {
        question: "What if I receive a damaged or incorrect item?",
        answer:
          "If you receive a damaged or incorrect item, please report it within 24 hours through the 'Help' section in your account or contact our customer support. We'll arrange for a replacement or refund.",
      },
      {
        question: "Are your prices the same as in-store prices?",
        answer:
          "Our prices are competitive and may sometimes differ slightly from in-store prices due to the convenience of delivery. We regularly compare our prices with local stores to ensure we offer good value.",
      },
      {
        question: "Do you offer discounts or promotions?",
        answer:
          "Yes, we regularly offer discounts and promotions. Check the 'Offers' section in our app or website to see current deals.",
      },
    ],
  },
  {
    id: "account",
    name: "Account & Payment",
    faqs: [
      {
        question: "How do I create an account?",
        answer:
          "You can create an account by clicking on the 'Login/Sign Up' button and following the registration process. You'll need to provide your email, create a password, and verify your phone number.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept credit/debit cards, UPI, digital wallets like Paytm and PhonePe, and cash on delivery.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Yes, we use industry-standard encryption to protect your payment information. We do not store your card details on our servers.",
      },
      {
        question: "How do I reset my password?",
        answer:
          "You can reset your password by clicking on 'Forgot Password' on the login page. We'll send a password reset link to your registered email address.",
      },
    ],
  },
  {
    id: "returns",
    name: "Returns & Refunds",
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "If you're not satisfied with a product, you can return it at the time of delivery. For perishable items, you must report issues within 24 hours of delivery.",
      },
      {
        question: "How long does it take to process a refund?",
        answer: "Refunds are typically processed within 5-7 business days, depending on your payment method and bank.",
      },
      {
        question: "Can I cancel my order?",
        answer:
          "You can cancel your order before it's prepared for delivery. Once the order is in the 'Preparing' stage, it cannot be canceled.",
      },
      {
        question: "Do you offer replacements for out-of-stock items?",
        answer:
          "Yes, we may suggest replacements for out-of-stock items during checkout. You can choose to accept these replacements or opt to receive a refund for unavailable items.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  // Filter FAQs based on search query and active category
  const filteredFAQs = faqCategories
    .filter((category) => activeCategory === "all" || category.id === activeCategory)
    .flatMap((category) =>
      category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    )

  return (
    <div className="container py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground mb-8">Find answers to common questions about our service</p>
        <div className="relative max-w-md mx-auto">
          <Input
            type="search"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-2 sticky top-20">
            <Button
              variant={activeCategory === "all" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveCategory("all")}
            >
              All Categories
            </Button>
            {faqCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          {searchQuery && (
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredFAQs.length} results found for "{searchQuery}"
            </p>
          )}

          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">We couldn't find any FAQs matching your search</p>
              <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
            </div>
          )}

          <div className="mt-12 p-6 border rounded-lg bg-muted/30 text-center">
            <h3 className="text-xl font-medium mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              If you couldn't find the answer to your question, please contact our support team
            </p>
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

