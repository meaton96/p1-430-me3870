import csv
import sys

def read_csv_file(filename):
    data = []
    with open(filename, newline='') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            data.append(row)
    return data

def normalize_cell(cell):
    parts = cell.split(';')
    normalized_parts = []
    for part in parts:
        subparts = part.split('&')
        if len(subparts) > 1:
            subparts = sorted(subparts)
            normalized_part = '&'.join(subparts)
        else:
            normalized_part = part
        normalized_parts.append(normalized_part)
    normalized_cell = ';'.join(normalized_parts)
    return  normalized_cell.lower()

def compare_csv(file1, file2):
    data1 = read_csv_file(file1)
    data2 = read_csv_file(file2)

    max_rows = max(len(data1), len(data2))
    differences = []

    for i in range(max_rows):
        row1 = data1[i] if i < len(data1) else []
        row2 = data2[i] if i < len(data2) else []
        max_cols = max(len(row1), len(row2))
        for j in range(max_cols):
            cell1 = row1[j] if j < len(row1) else ''
            cell2 = row2[j] if j < len(row2) else ''
            if cell1 == '' or cell2 == '' or j == 20 or j == 16:
                # Blank cell or columns to ignore, consider matching
                continue
            norm_cell1 = normalize_cell(cell1)
            norm_cell2 = normalize_cell(cell2)
            if norm_cell1 != norm_cell2:
                # Report difference
                differences.append((i+1, j+1, cell1, cell2))

    if differences:
        for diff in differences:
            print(f"Difference at Row {diff[0]}, Column {diff[1]}: '{diff[2]}' != '{diff[3]}'")
    else:
        print("No differences found.")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python compare_csv.py file1.csv file2.csv")
        sys.exit(1)
    file1 = sys.argv[1]
    file2 = sys.argv[2]
    compare_csv(file1, file2)