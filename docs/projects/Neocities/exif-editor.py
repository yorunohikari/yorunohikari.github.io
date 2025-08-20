import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk
import piexif

def read_description(image_path):
    try:
        img = Image.open(image_path)
        exif = piexif.load(img.info.get("exif", b""))
        desc = exif["0th"].get(piexif.ImageIFD.ImageDescription, b"").decode("utf-8", errors="ignore")
        return desc
    except Exception as e:
        return f"(Error reading description: {e})"

def write_description(image_path, new_desc):
    try:
        img = Image.open(image_path)
        exif_dict = piexif.load(img.info.get("exif", b""))
        exif_dict["0th"][piexif.ImageIFD.ImageDescription] = new_desc.encode("utf-8")
        exif_bytes = piexif.dump(exif_dict)
        img.save(image_path, exif=exif_bytes)
        return True
    except Exception as e:
        messagebox.showerror("Error", f"Failed to save description:\n{e}")
        return False

class ExifEditor:
    def __init__(self, root):
        self.root = root
        self.root.title("Image EXIF Description Editor")
        self.root.geometry("800x600")
        self.image_path = None
        self.img_preview = None  # To hold PhotoImage reference

        # Widgets
        self.img_label = tk.Label(root, text="No image loaded", width=40)
        self.img_label.pack(pady=10)

        self.image_canvas = tk.Label(root)
        self.image_canvas.pack(pady=5)

        self.desc_label = tk.Label(root, text="Current Description:")
        self.desc_label.pack()

        self.desc_text = tk.Text(root, height=5, width=70)
        self.desc_text.pack(pady=5)

        self.save_button = tk.Button(root, text="Save Description", command=self.save_description)
        self.save_button.pack(pady=10)

        self.open_button = tk.Button(root, text="Open Image", command=self.load_image)
        self.open_button.pack(pady=5)

    def load_image(self):
        filetypes = [("Image files", "*.jpg *.jpeg *.png *.webp *.tiff"), ("All files", "*.*")]
        path = filedialog.askopenfilename(filetypes=filetypes)
        if not path:
            return

        self.image_path = path
        self.img_label.config(text=f"Loaded: {path.split('/')[-1]}")

        # Load and display image
        try:
            img = Image.open(path)
            img.thumbnail((500, 400))  # Resize for preview
            self.img_preview = ImageTk.PhotoImage(img)
            self.image_canvas.config(image=self.img_preview)
        except Exception as e:
            self.image_canvas.config(image='', text=f"Error loading image: {e}")

        # Load EXIF description
        desc = read_description(path)
        self.desc_text.delete("1.0", tk.END)
        self.desc_text.insert(tk.END, desc)

    def save_description(self):
        if not self.image_path:
            messagebox.showwarning("No image", "Please load an image first.")
            return

        new_desc = self.desc_text.get("1.0", tk.END).strip()
        if write_description(self.image_path, new_desc):
            messagebox.showinfo("Success", "Description updated!")

# Run app
if __name__ == "__main__":
    root = tk.Tk()
    app = ExifEditor(root)
    root.mainloop()
