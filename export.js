const fs = require('fs');
const { minify } = require('terser');
const { JSDOM } = require('jsdom');


async function extractAndMinifyJs(htmlFile, outputFile) {
    const htmlContent = fs.readFileSync(htmlFile, 'utf-8');

    const dom = new JSDOM(htmlContent);
    const scripts = dom.window.document.querySelectorAll('script');

    let jsCode = '';
    scripts.forEach(script => {
        jsCode += script.textContent;
    });

    const { code: minifiedJs } = await minify(jsCode, {
        output: { quote_style: 1 },
        mangle: {
            toplevel: true
        },
    });

    const minifiedJsString = `"${minifiedJs.replace(/\n|\r/g, '').replace(/"/g, "'")}"`;
    console.log(minifiedJsString);

    const updatedHtmlContent = htmlContent.replace(/<script>[\s\S]*?<\/script>/g, '');
    const virtualHtmlContent = updatedHtmlContent.replace(/onClick="plugboardPress\(\)"/g, `onClick="virtualKeyPress()"`);
    const finalHtmlContent = virtualHtmlContent.replace(/onClick="virtualKeyPress\(\)"/g, `onClick=${minifiedJsString}`);

    fs.writeFileSync(outputFile, finalHtmlContent, 'utf-8');
}

extractAndMinifyJs('index.html', 'output.html');