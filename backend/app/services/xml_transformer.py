"""Transform a parsed XML dict into a flat context ready for the DOCX template."""

from __future__ import annotations
from typing import Any


def _ensure_list(value: Any) -> list:
    """xmltodict returns a single dict when there is one child; normalize to list."""
    if value is None:
        return []
    return value if isinstance(value, list) else [value]


def _extract_text(node: Any) -> str:
    """Return text content whether the node is a string or a dict with #text."""
    if isinstance(node, str):
        return node
    if isinstance(node, dict):
        return node.get("#text", str(node))
    return str(node) if node is not None else ""


def _flatten_dict(d: dict, parent_key: str = "", sep: str = ".") -> dict[str, str]:
    """Recursively flatten a nested dict for simple key-value display."""
    items: list[tuple[str, str]] = []
    for k, v in d.items():
        key = f"{parent_key}{sep}{k}" if parent_key else k
        if key.startswith("@"):
            continue
        if isinstance(v, dict):
            items.extend(_flatten_dict(v, key, sep).items())
        elif isinstance(v, list):
            for i, item in enumerate(v):
                if isinstance(item, dict):
                    items.extend(_flatten_dict(item, f"{key}[{i}]", sep).items())
                else:
                    items.append((f"{key}[{i}]", _extract_text(item)))
        else:
            items.append((key, _extract_text(v)))
    return dict(items)


def _collect_sections(data: dict, depth: int = 0, max_depth: int = 3) -> list[dict]:
    """Walk the XML tree and produce a list of sections with title + rows/children."""
    sections: list[dict] = []

    for key, value in data.items():
        if key.startswith("@") or key.startswith("#"):
            continue

        section: dict[str, Any] = {"title": key, "depth": depth, "rows": [], "children": []}

        if isinstance(value, dict):
            flat = {k: v for k, v in value.items() if not isinstance(v, (dict, list)) and not k.startswith("@")}
            section["rows"] = [{"campo": k, "valor": _extract_text(v)} for k, v in flat.items()]

            if depth < max_depth:
                nested = {k: v for k, v in value.items() if isinstance(v, (dict, list)) and not k.startswith("@")}
                section["children"] = _collect_sections(nested, depth + 1, max_depth)

        elif isinstance(value, list):
            items = _ensure_list(value)
            for i, item in enumerate(items):
                if isinstance(item, dict):
                    flat = _flatten_dict(item)
                    section["rows"].extend(
                        [{"campo": k, "valor": v} for k, v in flat.items()]
                    )
                    if i < len(items) - 1:
                        section["rows"].append({"campo": "---", "valor": "---"})
                else:
                    section["rows"].append({"campo": f"item_{i}", "valor": _extract_text(item)})
        else:
            section["rows"] = [{"campo": key, "valor": _extract_text(value)}]

        sections.append(section)

    return sections


def build_template_context(parsed: dict, project_name: str) -> dict:
    """Build the Jinja2-compatible context dict for docxtpl.

    Context keys:
        project_name  – user-supplied project name
        root_tag      – name of the XML root element
        sections      – list of {title, rows: [{campo, valor}], children: [...]}
        flat          – dict of all leaf key-value pairs (dot-separated keys)
    """
    root_tag = next(iter(parsed), "documento")
    root_content = parsed.get(root_tag, parsed)

    if not isinstance(root_content, dict):
        root_content = {root_tag: root_content}

    sections = _collect_sections(root_content)
    flat = _flatten_dict(root_content)

    return {
        "project_name": project_name,
        "root_tag": root_tag,
        "sections": sections,
        "flat": flat,
    }
