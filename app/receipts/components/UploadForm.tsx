"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";

export default function UploadForm({ userId }: { userId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState<number>(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsUploading(true);
    setMessage(null);
    setOcrProgress(0);

    try {
      const file = formData.get("file") as File;

      if (!file) {
        setMessage({ type: "error", text: "Ingen fil vald" });
        setIsUploading(false);
        return;
      }

      console.log("📤 Starting upload:", file.name, file.type);

      // Hoppa över OCR för PDF-filer
      let rawText = "";
      if (file.type.startsWith("image/")) {
        console.log("🔍 Running OCR...");
        // Kör OCR på bilden
        const result = await Tesseract.recognize(file, "swe+eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setOcrProgress(Math.round(m.progress * 100));
            }
          },
        });

        rawText = result.data.text;
        console.log("✓ OCR complete, text length:", rawText.length);
      }

      // Skapa ny FormData för API-anropet
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("rawText", rawText);

      console.log("📡 Calling API /api/receipts");

      // Ladda upp till servern via API
      const response = await fetch("/api/receipts", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await response.json();
      console.log("📥 API response:", result);

      if (result.ok) {
        setMessage({ type: "success", text: "Kvitto uppladdat och analyserat!" });
        setOcrProgress(0);
        // Reset form
        const form = document.getElementById("upload-form") as HTMLFormElement;
        form?.reset();
        // Refresh page to show new receipt
        window.location.reload();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Något gick fel vid uppladdningen",
        });
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      setMessage({
        type: "error",
        text: "Något gick fel vid uppladdningen, försök igen.",
      });
    } finally {
      setIsUploading(false);
      setOcrProgress(0);
    }
  }

  return (
    <div>
      <form id="upload-form" action={handleSubmit} className="space-y-4">
        <input type="hidden" name="userId" value={userId} />

        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium mb-2 text-gray-700"
          >
            Välj kvitto (foto eller PDF)
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/*,application/pdf"
            capture="environment"
            required
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />
        </div>

        {/* OCR Progress */}
        {ocrProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Läser kvitto...</span>
              <span>{ocrProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${ocrProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isUploading
            ? ocrProgress > 0
              ? `Läser kvitto... ${ocrProgress}%`
              : "Skickar och sparar..."
            : "Skicka och spara kvitto"}
        </button>
      </form>

      {/* Feedback message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
