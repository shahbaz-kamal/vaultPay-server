/* eslint-disable @typescript-eslint/no-unused-vars */
import { uploadBufferToCloudinary } from "../config/cloudinary.config";
import AppError from "../errorHelpers/AppError";
import { generatePdf, IInvoiceData } from "./invoice";
import { sendEmail } from "./sendEmail";

export const handleInvoiceSendAndUpload = async (invoiceData: IInvoiceData, numberOfEmailRecipients = 1) => {
  try {
    const pdfBuffer = await generatePdf(invoiceData);
    const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, `invoice-${invoiceData.invoiceId}`);
    console.log("cloudinary result:", cloudinaryResult);
    const emailRecievers = [];

    //   if transactions is made by user to user, send email to both sender and receiver
    emailRecievers.push(invoiceData.receiverEmail);
    if (numberOfEmailRecipients === 2 && invoiceData.senderEmail) emailRecievers.push(invoiceData.senderEmail);

    emailRecievers.forEach(async (email) => {
      await sendEmail({
        to: email,
        subject: "Your Transaction Invoice",
        templateName: "invoice",
        templateData: invoiceData,
        attachments: [
          {
            fileName: "invoice.pdf",
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
    });

    return { success: true, invoiceUrl: cloudinaryResult.secure_url };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    throw new AppError(500, "Invoice generation failed");
  }
};
