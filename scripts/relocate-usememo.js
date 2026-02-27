const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const useMemoString = "const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);";

    // Check if both exist
    if (content.includes(useMemoString) && content.includes('const { theme, isDark } = useTheme();')) {

        // Remove the existing useMemoString (which is likely at the bottom)
        // We'll replace all occurrences then inject exactly one where we need it

        // Use a regex to tolerate spacing
        const useMemoRegex = /const\s+styles\s*=\s*React\.useMemo\(\(\)\s*=>\s*getStyles\(theme,\s*isDark\),\s*\[theme,\s*isDark\]\);?\n?/g;

        content = content.replace(useMemoRegex, '');

        // Now find `const { theme, isDark } = useTheme();` and append the useMemoString right below it
        const hookStr = "const { theme, isDark } = useTheme();";

        // We replace only the FIRST occurrence in case there are multiple (unlikely)
        content = content.replace(hookStr, `${hookStr}\n    ${useMemoString}`);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Relocated useMemo in: ${filePath}`);
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
console.log(`Starting useMemo relocation on ${targetDir}`);
walkDir(targetDir);
console.log('Relocation complete.');
