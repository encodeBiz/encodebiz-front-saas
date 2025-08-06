// pages/api/verify-token.ts
import { verifyToken } from '@/lib/firebase/authentication/auth_utils';
import { NextResponse } from 'next/server';

export async function POST(request: any) {

  const data = await request.json();
  const { token } = data
  if (!token) return NextResponse.json(
    { message: 'No token provided' },
    { status: 401 }
  );

  try {     
    const decodedToken = await verifyToken(token);       
    return NextResponse.json({ user:decodedToken }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json(
      { message: "Invalid token" + error?.message as string },
      { status: 401 }
    );

  }
}