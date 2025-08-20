import os
import json
from datetime import datetime

# Path to the assets folder
image_folder = "./assets"

# Supported image extensions
image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg', '.tiff'}

# Folders to exclude (relative to assets/)
ignored_dirs = {"icon", "unused", "temp"}

# Collect image data: path and modified time
image_data = []
for root, dirs, files in os.walk(image_folder):
    # Skip ignored folders
    dirs[:] = [d for d in dirs if d not in ignored_dirs and not d.startswith(".")]

    for file in files:
        if os.path.splitext(file)[1].lower() in image_extensions:
            full_path = os.path.join(root, file)
            mtime = os.path.getmtime(full_path)
            timestamp = datetime.fromtimestamp(mtime).isoformat(timespec="seconds")
            relative_path = os.path.relpath(full_path, ".").replace("\\", "/")
            image_data.append({
                "path": "/" + relative_path,
                "modified": timestamp
            })

# Sort by modified time (newest first)
image_data.sort(key=lambda x: x["modified"], reverse=True)

# Save output to JSON
output_file = "images.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(image_data, f, indent=2)

print(f"{len(image_data)} image(s) listed with timestamps. Saved to {output_file}")
