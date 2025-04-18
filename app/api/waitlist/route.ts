import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Send welcome email
    await resend.emails.send({
      from: 'FarsiTest <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to FarsiTest!',
      html: `
        <h1>Welcome to FarsiTest!</h1>
        <p>Thank you for joining our waitlist. We'll keep you updated on our progress and let you know when we launch.</p>
        <p>Best regards,<br>The FarsiTest Team</p>
      `,
    });

    // Store the email in your database (you can add this later)
    // For now, we'll just return success

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      { error: 'Failed to process signup' },
      { status: 500 }
    );
  }
} 