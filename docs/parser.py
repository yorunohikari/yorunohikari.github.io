import tinycss2
from collections import OrderedDict
from pathlib import Path

def parse_rules(css_content):
    rules = tinycss2.parse_stylesheet(css_content, skip_whitespace=True)
    selector_map = OrderedDict()

    for rule in rules:
        if rule.type != "qualified-rule":
            continue

        prelude = tinycss2.serialize(rule.prelude).strip()
        declarations = tinycss2.parse_declaration_list(rule.content)

        props = OrderedDict()
        for decl in declarations:
            if decl.type == "declaration":
                props[decl.name] = tinycss2.serialize(decl.value).strip()

        if prelude in selector_map:
            selector_map[prelude].update(props)
        else:
            selector_map[prelude] = props

    return selector_map

def merge_css(file1, file2, output_file):
    css1 = Path(file1).read_text()
    css2 = Path(file2).read_text()

    merged_map = parse_rules(css1)
    second_map = parse_rules(css2)

    for selector, props in second_map.items():
        if selector in merged_map:
            merged_map[selector].update(props)
        else:
            merged_map[selector] = props

    # Build output
    with open(output_file, "w") as f:
        for selector, props in merged_map.items():
            f.write(f"{selector} {{\n")
            for name, value in props.items():
                f.write(f"  {name}: {value};\n")
            f.write("}\n\n")

    print(f"Merged CSS saved to: {output_file}")

if __name__ == "__main__":
    merge_css("file1.css", "file2.css", "final.css")
