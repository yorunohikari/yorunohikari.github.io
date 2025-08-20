import os
import json
from datetime import datetime
from bs4 import BeautifulSoup

# === CONFIG ===
root_folder = "."
ignored_dirs = {"draft"}  # Folder names to skip

# === Extract title and meta description ===
def extract_metadata(html_file):
    try:
        with open(html_file, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
            title_tag = soup.find("title")
            title = title_tag.get_text(strip=True) if title_tag else ""
            meta = soup.find("meta", attrs={"name": "description"})
            desc = meta["content"].strip() if meta and meta.get("content") else ""
            return title, desc
    except Exception as e:
        print(f"Warning: Failed to parse {html_file}: {e}")
        return "", ""

pages = []

for root, dirs, files in os.walk(root_folder):
    # Remove ignored directories (in-place)
    dirs[:] = [d for d in dirs if d not in ignored_dirs and not d.startswith(".")]

    for file in files:
        if file.endswith(".html"):
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, ".").replace("\\", "/")

            # Get modified time
            mtime = os.path.getmtime(full_path)
            timestamp = datetime.fromtimestamp(mtime).isoformat(timespec="seconds")

            # Get metadata
            title, desc = extract_metadata(full_path)

            # Adjust path if it's index.html
            if file == "index.html":
                folder = os.path.dirname(rel_path)
                page_path = "" if folder == "." else folder + "/"
            else:
                page_path = rel_path

            pages.append({
                "path": page_path,
                "modified": timestamp,
                "title": title,
                "description": desc
            })

# Sort newest first
pages.sort(key=lambda x: x["modified"], reverse=True)

# Output to JSON
with open("pages.json", "w", encoding="utf-8") as f:
    json.dump(pages, f, indent=2, ensure_ascii=False)

print(f"{len(pages)} HTML page(s) indexed (with title, description, modified time).")
