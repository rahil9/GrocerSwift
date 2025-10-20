import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { to, subject, html } = body as { to: string; subject: string; html: string }

    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 })
    }

    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 587)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.SMTP_FROM || user

    if (!host || !user || !pass) {
      return new Response(JSON.stringify({ error: "SMTP is not configured" }), { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    await transporter.sendMail({ from, to, subject, html })

    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  } catch (error) {
    console.error("send-order-email error", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 })
  }
}


