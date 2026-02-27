const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Check if it uses getStyles(theme, isDark) without useTheme()
    if (content.includes('getStyles(theme, isDark)') && !content.includes('const { theme, isDark } = useTheme();')) {
        // Find component definition, e.g., const MyComp = () => { or export function MyComp() {
        const componentRegex = /((?:export\s+(?:default\s+)?)?(?:const|function)\s+[A-Za-z0-9_]+\s*(?::\s*React\.FC(?:<[^>]+>)?\s*)?(?:=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+\s*(?::\s*any)?)\s*=>|\([^)]*\))\s*\{)/;

        if (componentRegex.test(content)) {
            content = content.replace(componentRegex, `$1\n    const { theme, isDark } = useTheme();\n`);
        } else {
            console.warn(`Could not parse component signature in: ${filePath}`);
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched hook in: ${filePath}`);
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
console.log(`Starting final patch on ${targetDir}`);
walkDir(targetDir);
console.log('Final patch complete.');
