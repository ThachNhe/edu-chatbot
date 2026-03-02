import fitz
import pytesseract
from PIL import Image
import io

def pdf_to_text(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    full_text = ""
    
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=300)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        text = pytesseract.image_to_string(img, lang="vie+eng")
        full_text += f"\n--- Trang {i+1} ---\n{text}"
        print(f"✓ {i+1}/{len(doc)}")
    
    return full_text

text = pdf_to_text("Tin-hoc-12.pdf")
with open("output.txt", "w", encoding="utf-8") as f:
    f.write(text)

print("Done!")