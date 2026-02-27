const fs = require('fs');
const path = require('path');

function processPatch(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Target files that use theme/isDark but don't define it
    if (content.includes('getStyles(theme, isDark)') && !content.includes('const { theme, isDark }')) {

        // This regex looks for: 
        // 1. `const Component: React.FC = () => {`
        // 2. `const Component = () => {`
        // 3. `export default function Component() {`
        // We capture up to the `{`

        const componentRegex = /((?:export\s+default\s+)?(?:const|function)\s+[A-Za-z0-9_]+\s*(?::\s*React\.FC(?:<[^>]+>)?\s*)?(?:=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>|\([^)]*\))\s*\{)/m;

        if (componentRegex.test(content)) {
            content = content.replace(componentRegex, `$1\n    const { theme, isDark } = useTheme();\n`);
        } else {
            // Very aggressive fallback if it's export default function X() {
            const fallbackRegex = /(export\s+default\s+function\s+[A-Za-z0-9_]+\([^)]*\)\s*\{)/m;
            if (fallbackRegex.test(content)) {
                content = content.replace(fallbackRegex, `$1\n    const { theme, isDark } = useTheme();\n`);
            }
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
            processPatch(fullPath);
        }
    }
}

const targetDir = path.join(__dirname, '../app');
console.log(`Starting patch on ${targetDir}`);
walkDir(targetDir);
console.log('Patch complete.');
