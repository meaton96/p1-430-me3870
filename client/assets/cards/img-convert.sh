#!/bin/bash

# Directories
INPUT_DIR="./png"
OUTPUT_DIR="./webp"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Loop through all PNG files in the input directory
for file in "$INPUT_DIR"/*.png; do
    # Check if there are any PNG files
    if [ -e "$file" ]; then
        filename=$(basename "$file")
        output_file="$OUTPUT_DIR/${filename%.png}.webp"

        # Convert PNG to WebP
        cwebp "$file" -o "$output_file"

        echo "Converted: $filename to ${filename%.png}.webp"
    else
        echo "No PNG files found in $INPUT_DIR."
        break
    fi
done
