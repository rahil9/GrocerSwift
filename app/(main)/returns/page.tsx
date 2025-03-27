import Link from "next/link"
import { RefreshCw, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ReturnsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Returns & Refunds Policy</h1>
        <p className="text-xl text-muted-foreground mb-8">Our commitment to customer satisfaction</p>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Returns Policy</h2>
            </div>
            <p className="mb-4">
              At QuickGrocer, we strive to ensure that all products delivered to you are fresh, undamaged, and of the
              highest quality. However, we understand that sometimes you may need to return items.
            </p>
            <h3 className="text-xl font-medium mb-2">Eligible Returns</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Damaged or defective products</li>
              <li>Expired products</li>
              <li>Incorrect items (different from what you ordered)</li>
              <li>Missing items from your order</li>
              <li>Products that don't meet our quality standards</li>
            </ul>
            <h3 className="text-xl font-medium mb-2">Return Process</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                You can return items at the time of delivery by simply handing them back to our delivery personnel.
              </li>
              <li>
                For issues discovered after delivery, you must report them within 24 hours for perishable items and 48
                hours for non-perishable items.
              </li>
              <li>
                To initiate a return, go to the "Orders" section in your account and select the order with the item(s)
                you wish to return.
              </li>
              <li>Select the specific item(s) and provide a reason for the return.</li>
              <li>Our customer service team will review your request and get back to you within 24 hours.</li>
            </ol>
          </section>

          <Separator />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Refunds Policy</h2>
            </div>
            <p className="mb-4">
              Once your return is approved, we will process your refund according to the following guidelines:
            </p>
            <h3 className="text-xl font-medium mb-2">Refund Methods</h3>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Original payment method:</strong> Refunds will be processed to the original payment method used
                for the purchase.
              </li>
              <li>
                <strong>Store credit:</strong> You can opt to receive store credit instead of a refund to your original
                payment method.
              </li>
              <li>
                <strong>Replacement:</strong> For certain items, we may offer a replacement instead of a refund.
              </li>
            </ul>
            <h3 className="text-xl font-medium mb-2">Refund Timeline</h3>
            <p className="mb-4">Refund processing times vary depending on your payment method:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Credit/Debit Cards:</strong> 5-7 business days
              </li>
              <li>
                <strong>UPI/Digital Wallets:</strong> 1-3 business days
              </li>
              <li>
                <strong>Store Credit:</strong> Immediate
              </li>
              <li>
                <strong>Cash on Delivery:</strong> 7-10 business days (refunded to your bank account)
              </li>
            </ul>
          </section>

          <Separator />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Non-Returnable Items</h2>
            </div>
            <p className="mb-4">The following items cannot be returned once delivered:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Items that have been opened, partially consumed, or used (except in cases of damage or quality issues)
              </li>
              <li>Personal hygiene products</li>
              <li>Intimate apparel</li>
              <li>Gift cards</li>
              <li>Downloadable products</li>
              <li>Customized or personalized items</li>
            </ul>
          </section>

          <Separator />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Can I return part of my order?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can return specific items from your order without returning the entire order. Simply select
                  the items you wish to return when initiating the return process.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>What if I received a damaged item?</AccordionTrigger>
                <AccordionContent>
                  If you receive a damaged item, please take a photo of the damage and contact our customer service team
                  within 24 hours. We'll arrange for a replacement or refund.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I get a refund if I simply change my mind?</AccordionTrigger>
                <AccordionContent>
                  For non-perishable items in their original, unopened packaging, we offer a 7-day return policy if you
                  change your mind. Perishable items cannot be returned if you change your mind due to food safety
                  concerns.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>What happens if I'm not available during delivery?</AccordionTrigger>
                <AccordionContent>
                  If you're not available during delivery, our delivery personnel will wait for up to 5 minutes. After
                  that, they will take the order back, and you'll be charged a restocking fee of ₹50. You can reschedule
                  the delivery through our customer service.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>How do I track my refund status?</AccordionTrigger>
                <AccordionContent>
                  You can track your refund status in the "Orders" section of your account. Once a refund is processed,
                  you'll receive an email notification with the details.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <div className="bg-muted/30 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold mb-2">Need more help?</h3>
            <p className="mb-4">
              If you have any questions about our returns and refunds policy or need assistance with a return, our
              customer service team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/faq">View FAQs</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

