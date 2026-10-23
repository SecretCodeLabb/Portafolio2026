"""Genera las versiones web de los renders originales.

Uso (desde la carpeta portfolio/):  python tools/optimize_media.py
Lee las carpetas originales del nivel superior y escribe en assets/.
Requiere Pillow y ffmpeg en el PATH.
"""
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT.parent
IMG = ROOT / "assets" / "img"
VID = ROOT / "assets" / "video"

# carpeta original -> (slug, [(archivo, nombre_salida)])
PROJECTS = {
    "gtr": ("Carro", ["portadaReel.png", "2.png", "3.png", "4.png", "5.png", "6.png",
                      "Blanco.png", "Morado.png", "Verde.png"]),
    "wasteland": ("CarroPostApocaliptico", ["Portada.png", "1.jpg", "2.jpg", "3.jpg",
                                            "4.jpg", "5.jpg", "6.jpg"]),
    "ledger": ("Gun", ["Portada.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg",
                       "6.jpg", "7.jpg"]),
    "chef-coco": ("Personaje", ["portada.png", "1.png", "2.png", "3.png", "4.png"]),
    "whiskey": ("Productos", ["Whiskey.jpg", "Whiskey2.jpg", "Whiskey3.jpg"]),
    "marathon": ("Productos", ["latas3.png", "latas1.png", "latas2.png", "latas4.png"]),
}

FULL, THUMB = 2400, 900


def slugify(name):
    stem = Path(name).stem.lower()
    return "cover" if stem in ("portada", "portadareel") else stem


def save_image(src, out_dir, name):
    im = Image.open(src)
    if im.mode == "RGBA":
        bg = Image.new("RGB", im.size, (0, 0, 0))
        bg.paste(im, mask=im.split()[3])
        im = bg
    im = im.convert("RGB")
    for size, suffix, q in ((FULL, "", 84), (THUMB, "-sm", 80)):
        copy = im.copy()
        copy.thumbnail((size, size), Image.LANCZOS)
        copy.save(out_dir / f"{name}{suffix}.webp", "WEBP", quality=q, method=6)


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-y", "-v", "error", *args], check=True)


def main():
    for slug, (folder, files) in PROJECTS.items():
        out = IMG / slug
        out.mkdir(parents=True, exist_ok=True)
        for f in files:
            save_image(SRC / folder / f, out, slugify(f))
            print("img", slug, f)

    brand = ROOT / "assets" / "brand"
    brand.mkdir(parents=True, exist_ok=True)
    logo = Image.open(SRC / "logoPersonal.png")
    logo = logo.crop(logo.getbbox())
    logo.thumbnail((512, 512), Image.LANCZOS)
    logo.save(brand / "logo.png", optimize=True)

    VID.mkdir(parents=True, exist_ok=True)
    enc = ["-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p",
           "-movflags", "+faststart", "-an"]
    videos = [
        (SRC / "Carro" / "VideoGTR.mov", "gtr-reel", "scale=1920:-2", "24"),
        (SRC / "Rolex.mp4", "rolex", "scale=1920:-2", "24"),
        (SRC / "cadenas.mp4", "cadenas", "scale=1080:-2", "24"),
    ]
    for src, name, scale, crf in videos:
        ffmpeg("-i", str(src), "-vf", scale, *enc, "-crf", crf, str(VID / f"{name}.mp4"))
        ffmpeg("-ss", "1.5", "-i", str(src), "-frames:v", "1", "-vf", scale,
               "-q:v", "80", str(VID / f"{name}-poster.webp"))
        print("video", name)


if __name__ == "__main__":
    main()
