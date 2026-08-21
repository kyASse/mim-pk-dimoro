const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const templatePath = path.join(__dirname, 'formulir-template.html');
const logoPath = path.join(rootDir, 'public', 'Logo-TK-ABA.png');
const tempHtmlPath = path.join(__dirname, 'temp-render.html');
const outputPdfPath = path.join(rootDir, 'public', 'Formulir Pendaftaran MIM PK Dimoro.pdf');

const logoBase64 = fs.readFileSync(logoPath).toString('base64');
let htmlContent = fs.readFileSync(templatePath, 'utf-8');
htmlContent = htmlContent.replace('LOGO_BASE64_PLACEHOLDER', logoBase64);

fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const command = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPdfPath}" --no-pdf-header-footer "file:///${tempHtmlPath.replace(/\\/g, '/')}"`;

console.log('Generating PDF...');
execSync(command, { stdio: 'inherit' });

if (fs.existsSync(tempHtmlPath)) {
  fs.unlinkSync(tempHtmlPath);
}

console.log('PDF successfully generated at:', outputPdfPath);
