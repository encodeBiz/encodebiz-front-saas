// pages/api/verify-token.ts
import { signInWithToken, verifyToken } from '@/lib/firebase/authentication/auth_utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, response: NextResponse) {

  const data = await request.json();
  const { token } = data
  if (!token) return NextResponse.json(
    { message: 'No token provided' },
    { status: 401 }
  );

  try {     
    const decodedToken = await verifyToken(token);       
    return NextResponse.json({ user:decodedToken }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );

  }
}