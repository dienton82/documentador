"""XML parser: validates and converts XML bytes into a Python dict."""

import xmltodict
from xml.etree.ElementTree import fromstring, ParseError


def validate_xml(raw: bytes) -> str:
    """Return the decoded XML string or raise ValueError."""
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        try:
            text = raw.decode("latin-1")
        except Exception as exc:
            raise ValueError(f"No se pudo decodificar el archivo: {exc}") from exc

    try:
        fromstring(text)
    except ParseError as exc:
        raise ValueError(f"XML malformado: {exc}") from exc

    return text


def parse_xml(raw: bytes) -> dict:
    """Validate + parse XML bytes into an ordered dict."""
    text = validate_xml(raw)
    return xmltodict.parse(text)
