export function viewInvoiceDate(inputString: string) {
  const date = new Date(inputString);
  const year = date.getFullYear().toString().substring(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours() % 12 || 12;
  const minute = date.getMinutes().toString().padStart(2, "0");
  const period = date.getHours() >= 12 ? "pm" : "am";
  const formattedDate = `${day}-${month}-${year} | ${hour}:${minute} ${period}`;
  return formattedDate;
}

export function downloadPDF(pdfContent: any, fileName: any) {
  const blob = new Blob([pdfContent], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
}

export async function downloadPhoto(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const blob = await response.blob();
    const blobURL = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = url.split("/").reverse()[0] ?? "xen-capture-photo.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobURL);
    return true;
  } catch (error) {
    console.error("Error downloading photo:", error);
  }
}
