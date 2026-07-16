const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    const depth = filePath.split(path.sep).length - path.resolve(__dirname).split(path.sep).length;
    let importPath = '';
    if (depth === 0) importPath = './utils/alertUtils';
    else if (depth === 1) importPath = '../utils/alertUtils';
    else if (depth === 2) importPath = '../../utils/alertUtils';
    else importPath = '../../../utils/alertUtils';

    let needsImport = false;

    if (content.includes('window.confirm(')) {
        content = content.replace(/window\.confirm\((.*?)\)/g, '(await confirmAction($1))');
        needsImport = true;
    }

    if (content.includes('alert(')) {
        content = content.replace(/alert\((.*?)\)/g, 'showToast($1, "success")');
        needsImport = true;
    }
    
    if (content.includes('toast.error(') || content.includes('toast.success(')) {
       content = content.replace(/toast\.error\((.*?)\)/g, 'showToast($1, "error")');
       content = content.replace(/toast\.success\((.*?)\)/g, 'showToast($1, "success")');
       content = content.replace(/import \{ toast \} from 'react-hot-toast';\r?\n/g, '');
       needsImport = true;
    }

    if (needsImport && content !== original) {
        if (!content.includes('alertUtils')) {
            const importStatement = `import { showToast, confirmAction } from '${importPath.replace(/\\/g, '/')}';\n`;
            const lastImportIndex = content.lastIndexOf('import ');
            if (lastImportIndex !== -1) {
                const endOfLine = content.indexOf('\n', lastImportIndex);
                content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
            } else {
                content = importStatement + content;
            }
        }
        
        content = content.replace(/showToast\((.*?), "success"\)/g, (match, p1) => {
            const lower = p1.toLowerCase();
            if (lower.includes('lỗi') || lower.includes('không') || lower.includes('vui lòng') || lower.includes('thất bại')) {
                return `showToast(${p1}, "error")`;
            }
            if (lower.includes('cảnh báo') || lower.includes('chú ý')) {
                return `showToast(${p1}, "warning")`;
            }
            return match;
        });

        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated', filePath);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

walk(__dirname);
