import svgwrite
import os

def generate_icons():
    # Create icons directory if it doesn't exist
    icons_dir = 'icons'
    if not os.path.exists(icons_dir):
        os.makedirs(icons_dir)
    
    # Define icon sizes for Chrome extension
    sizes = [16, 32, 48, 128]
    
    # Claude's colors
    terra_cotta = "#da7756"
    dark_text = "#3d3929"
    bg_color = "#eeece2"
    
    for size in sizes:
        # Create SVG with specified size
        svg_path = os.path.join(icons_dir, f'icon{size}.svg')
        dwg = svgwrite.Drawing(svg_path, size=(size, size))
        
        # Calculate proportions
        padding = size * 0.1
        keyboard_width = size - (padding * 2)
        keyboard_height = keyboard_width * 0.7
        key_size = keyboard_width * 0.2
        key_gap = keyboard_width * 0.05
        stroke_width = max(1, size * 0.04)
        
        # Draw keyboard outline
        dwg.add(dwg.rect(
            insert=(padding, (size - keyboard_height) / 2),
            size=(keyboard_width, keyboard_height),
            rx=size * 0.08,
            fill=bg_color,
            stroke=dark_text,
            stroke_width=stroke_width
        ))
        
        # Draw keys (3x4 grid)
        start_x = padding + (keyboard_width - (3 * key_size + 2 * key_gap)) / 2
        start_y = (size - keyboard_height) / 2 + keyboard_height * 0.2
        
        for row in range(3):
            for col in range(3):
                # Skip some keys to create a more recognizable keyboard shape
                if row == 2 and col != 1:
                    continue
                    
                x = start_x + (col * (key_size + key_gap))
                y = start_y + (row * (key_size + key_gap))
                
                # Make the center key special
                if row == 1 and col == 1:
                    fill_color = terra_cotta
                else:
                    fill_color = 'white'
                
                dwg.add(dwg.rect(
                    insert=(x, y),
                    size=(key_size, key_size),
                    rx=size * 0.04,
                    fill=fill_color,
                    stroke=dark_text,
                    stroke_width=stroke_width * 0.8
                ))
        
        # Save SVG
        dwg.save()
        
        # Convert to PNG
        try:
            import cairosvg
            png_path = os.path.join(icons_dir, f'icon{size}.png')
            cairosvg.svg2png(
                url=svg_path,
                write_to=png_path,
                output_width=size,
                output_height=size
            )
            print(f"Generated {png_path}")
        except ImportError:
            print("cairosvg not installed, skipping PNG conversion")

if __name__ == "__main__":
    generate_icons()
    print("Icon generation complete!")
