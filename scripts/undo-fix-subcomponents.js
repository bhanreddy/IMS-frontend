const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Undo the implicit arrow function replacement
    // Because the suffix could be anything, let's rigidly match the injected lines:
    const injectedImplicitMatch = /(const\s+[A-Za-z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*)\{\n\s*const \{ theme, isDark \} = useTheme\(\);\n\s*const styles = React\.useMemo\(\(\) => getStyles\(theme, isDark\), \[theme, isDark\]\);\n\s*return \(([\s\S]*?)\)(;?)\n\}/g;

    content = content.replace(injectedImplicitMatch, (match, prefix, body, suffix) => {
        return `${prefix}(${body})${suffix}`;
    });

    // Undo the block injection
    const blockUndoMatch = /((?:const|let|var)\s+[A-Za-z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*\{|function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{)\n\s*const \{ theme, isDark \} = useTheme\(\);\n\s*const styles = React\.useMemo\(\(\) => getStyles\(theme, isDark\), \[theme, isDark\]\);/g;

    content = content.replace(blockUndoMatch, (match, prefix) => {
        return prefix;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Reverted subcomponents in: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

const targetDir = path.join(__dirname, '../app');
console.log('Starting subcomponent undo...');
walkDir(targetDir);
console.log('Done.');
