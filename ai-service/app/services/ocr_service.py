import easyocr

# Initialize the OCR reader once when the application starts
reader = easyocr.Reader(["en"])


def extract_text(image_path: str) -> str:
    """
    Extract text from an image using EasyOCR.
    """

    results = reader.readtext(image_path)

    extracted_text = " ".join([result[1] for result in results])

    return extracted_text