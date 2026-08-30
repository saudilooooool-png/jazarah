from collections import deque
from pathlib import Path
from PIL import Image

ROOT = Path('/home/ubuntu/jazarah-branch-analysis')


def close_to(pixel, color, tolerance):
    return max(abs(pixel[i] - color[i]) for i in range(3)) <= tolerance


def remove_edge_background(source, destination, tolerance):
    image = Image.open(source).convert('RGBA')
    width, height = image.size
    pixels = image.load()
    corners = [pixels[0, 0], pixels[width - 1, 0], pixels[0, height - 1], pixels[width - 1, height - 1]]
    background = tuple(round(sum(c[i] for c in corners) / len(corners)) for i in range(3))

    queue = deque()
    visited = set()
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited or x < 0 or y < 0 or x >= width or y >= height:
            continue
        visited.add((x, y))
        pixel = pixels[x, y]
        if not close_to(pixel, background, tolerance):
            continue
        pixels[x, y] = (pixel[0], pixel[1], pixel[2], 0)
        queue.append((x + 1, y))
        queue.append((x - 1, y))
        queue.append((x, y + 1))
        queue.append((x, y - 1))

    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination)
    return image.size, background, len(visited)


jobs = [
    (ROOT / 'farm/buildings/home.png', ROOT / 'farm/buildings/home_exact.png', 34),
    (ROOT / 'farm/buildings/barn.png', ROOT / 'farm/buildings/barn_exact.png', 34),
]

for source in (ROOT / 'avatars/jazzour').glob('*.webp'):
    jobs.append((source, ROOT / 'farm/characters/jazour' / f'{source.stem}.png', 18))

for source, destination, tolerance in jobs:
    size, background, _ = remove_edge_background(source, destination, tolerance)
    print(f'{source.relative_to(ROOT)} -> {destination.relative_to(ROOT)} | {size[0]}x{size[1]} | bg={background}')
