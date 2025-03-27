import Link from "next/link"
import { Truck, Clock, Package, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function ShippingPolicyPage() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Shipping Policy</h1>
        <p className="text-xl text-muted-foreground mb-8">Everything you need to know about our delivery process</p>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Delivery Areas</h2>
            </div>
            <p className="mb-4">QuickGrocer currently delivers to the following areas:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>All major metropolitan areas including Delhi, Mumbai, Bangalore, Chennai, Kolkata, and Hyderabad</li>
              <li>Select Tier 2 cities including Pune, Ahmedabad, Jaipur, and Chandigarh</li>
              <li>Surrounding suburban areas within a 15km radius of our dark stores</li>
            </ul>
            <p>To check if we deliver to your area, enter your pincode on our homepage or during checkout.</p>
          </section>

          <Separator />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Delivery Times</h2>
            </div>
            <p className="mb-4">We pride ourselves on our quick delivery service:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>
                <strong>Express Delivery:</strong> 10-30 minutes (available in select areas)
              </li>
              <li>
                <strong>Standard Delivery:</strong> 30-60 minutes
              </li>
              <li>
                <strong>Scheduled Delivery:</strong> Choose a 1-hour time slot up to 2 days in advance
              </li>
            </ul>
            <p className="mb-4">
              Our delivery hours are from 8:00 AM to 11:00 PM, seven days a week, including holidays.
            </p>
            <p>
              Please note that delivery times may be affected by factors such as weather conditions, traffic, and high
              order volumes during peak hours.
            </p>
          </section>

          <Separator />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Delivery Fees</h2>
            </div>
            <p className="mb-4">Our delivery fees are structured as follows:</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="border p-2 text-left">Order Value</th>
                    <th className="border p-2 text-left">Standard Delivery</th>
                    <th className="border p-2 text-left">Express Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Below ₹200</td>
                    <td className="border p-2">₹30</td>
                    <td className="border p-2">₹50</td>
                  </tr>
                  <tr>
                    <td className="border p-2">₹200 - ₹500</td>
                    <td className="border p-2">₹20</td>
                    <td className="border p-2">₹40</td>
                  </tr>
                  <tr>
                    <td className="border p-2">₹500 - ₹1000</td>
                    <td className="border p-2">₹10</td>
                    <td className="border p-2">₹30</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Above ₹1000</td>
                    <td className="border p-2">FREE</td>
                    <td className="border p-2">₹20</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Additional fees may apply for deliveries to remote areas or during extreme weather conditions.
            </p>
          </section>

          <Separator />

          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Important Information</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Our delivery personnel will call you when they arrive at your location.</li>
              <li>If you're not available to receive your order, we'll wait for up to 5 minutes before leaving.</li>
              <li>
                For contactless delivery, please select this option during checkout and provide specific drop-off
                instructions.
              </li>
              <li>All orders are packaged with care to ensure items remain fresh and undamaged during transit.</li>
              <li>Perishable items are transported in temperature-controlled bags to maintain freshness.</li>
              <li>You can track your order in real-time through our app or website.</li>
            </ul>
          </section>

          <div className="bg-muted/30 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-bold mb-2">Have more questions?</h3>
            <p className="mb-4">
              If you have any questions about our shipping policy or need assistance with your delivery, please don't
              hesitate to contact us.
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

