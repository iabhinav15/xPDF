import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { generatePublicUrl, uploadFile } from "@/helpers/uploadPdfToGoogleDrive";
import fs from 'fs';

connect();

export async function POST(request) {
  
  try {
    const data = await request.formData();
    const file = data.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded', success:false }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = file.name;

    const userId = await getDataFromToken(request);
    let user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found', success:false }, { status: 404 });
    }
    
    if (!user.files.includes(fileName)) {

      // Save the file to upload to google drive
      const path = `public/uploads/${fileName}`;
      await writeFile(path, buffer);

      // Upload the file to Google Drive
      const fileId = await uploadFile(path, fileName);
      const fileUrl = await generatePublicUrl(fileId);

      // Delete the file from local environment after uploading to Google Drive
      fs.unlinkSync(path);

      // Save the file to the user's files array
      user.files.push({fileUrl, fileName});
      await user.save();
    }

    return NextResponse.json({ message: 'File uploaded successfully', success:true });

  } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
  }

}