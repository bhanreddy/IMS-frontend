const fs = require('fs');
const path = require('path');

function processPatch(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // We only care if the file has "getStyles(theme, isDark)" but NO "useTheme()"
    if (content.includes('getStyles(theme, isDark)') && !content.includes('useTheme()')) {

        // Find the component definition
        // We'll look for `function X()` or `const X = (...) => {`
        const componentRegex = /((?:export\s+default\s+)?(?:function|const)\s+[A-Za-z0-9_]+\s*(?:=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>|\([^)]*\))\s*(?::\s*React\.FC(?:<[^>]+>)?\s*)?\{)/m;

        if (componentRegex.test(content)) {
            content = content.replace(componentRegex, `$1\n    const { theme, isDark } = useTheme();\n`);
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
console.log('Patch complete. Please dry-run compilation.');