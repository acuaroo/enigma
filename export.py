from bs4 import BeautifulSoup
import jsmin

def extract_and_minify_js(html_file):
    with open(html_file, 'r', encoding='utf-8') as file:
        html_content = file.read()

    soup = BeautifulSoup(html_content, 'html.parser')

    js_code = ''
    for script_tag in soup.find_all('script'):
        js_code += script_tag.get_text()


    minified_js = jsmin.jsmin(js_code)

    minified_js = minified_js.replace('\n', '').replace('\r', '')
    minified_js = minified_js.replace('"', "'")

    minified_js +="virtualKeyPress();"

    minified_js_string = f'"{minified_js}"'

    print(minified_js_string)

extract_and_minify_js('index.html')
