const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Check if we need the hook
    if (!content.includes('getStyles(theme, isDark)') || content.includes('const { theme, isDark } = useTheme();')) {
        return;
    }

    // Try finding the return statement of the TOP LEVEL component
    // Assuming the main export function or const has a return statement
    // We will inject the hook right before the LAST `return (` or `return <`

    // Find all 'return' occurrences that look like JSX
    const returnRegex = /return\s*[\(<]/g;
    let match;
    let lastMatchIndex = -1;

    while ((match = returnRegex.exec(content)) !== null) {
        lastMatchIndex = match.index;
    }

    if (lastMatchIndex !== -1) {
        // We found the last return. Let's make sure it's inside a function block
        // by just injecting it right above
        content = content.slice(0, lastMatchIndex) +
            `    const { theme, isDark } = useTheme();\n    ` +
            content.slice(lastMatchIndex);
    } else {
        console.warn(`Could not find a JSX return statement to inject hook in: ${filePath}`);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Injected hook before return in: ${filePath}`);
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
console.log(`Starting return-based injection on ${targetDir}`);
walkDir(targetDir);
console.log('Injection complete.');
