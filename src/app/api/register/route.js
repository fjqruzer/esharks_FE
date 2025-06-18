import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    const body = await request.json();

    // Basic validation (you can expand this)
    if (
      !body.FirstName ||
      !body.LastName ||
       body.MI ||
      !body.email ||
      !body.password ||
       body.SchoolID ||
      !body.password_confirmation ||
      !body.PhoneNumber
    ) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    if (body.password !== body.password_confirmation) {
      return NextResponse.json({ success: false, message: "Passwords do not match." }, { status: 400 });
    }


    const existing = await db.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return NextResponse.json({ success: false, message: "Email already registered." }, { status: 409 });
    }


    const hashedPassword = await hash(body.password, 10);


    const newUser = await db.user.create({
      data: {
        FirstName: body.FirstName,
        MI: body.MI,
        LastName: body.LastName,
        email: body.email,
        password: hashedPassword,
        PhoneNumber: body.contNum,
        SchoolID: body.SchoolID,
      
      },
    });

    // For now, just return the received data (remove in production)
    return NextResponse.json({ success: true, user: {
      FirstName: body.FirstName,
      LName: body.LastName,
      email: body.email,
      contNum: body.PhoneNumber,
      SchoolID: body.SchoolID,
      MI: body.MI,
    }});
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}