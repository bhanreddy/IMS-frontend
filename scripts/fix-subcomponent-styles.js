const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Check if file uses styles but has errors (we can just heuristically inject)
    // We will look for component declarations that use `styles.` but DO NOT have `const styles =`
    // A component is typically `const Name = ({ props }) => {` or `function Name() {`
    // But sometimes it's `const Name = () => (` which is an implicit return.

    // To be safe, we'll convert `const Name = (props) => (` to `const Name = (props) => { const {theme, isDark} = useTheme(); const styles = React.useMemo(()=>getStyles(theme,isDark),[theme,isDark]); return (`

    const arrowImplicitRegex = /(const\s+[A-Za-z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*)\(([\s\S]*?styles\.[a-zA-Z0-9_]+[\s\S]*?)\)(;?)/g;

    content = content.replace(arrowImplicitRegex, (match, prefix, body, suffix) => {
        if (body.includes('const styles =')) return match;
        return `${prefix}{\n    const { theme, isDark } = useTheme();\n    const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);\n    return (${body})${suffix}\n}`;
    });

    // For block components `const Name = (props) => { ... }` or `function Name() { ... }`
    const blockRegex = /((?:const|let|var)\s+[A-Za-z0-9_]+\s*=\s*\([^)]*\)\s*=>\s*\{|function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{)([\s\S]*?\})/g;

    content = content.replace(blockRegex, (match, prefix, body) => {
        // If it doesn't use styles, or already defines styles, skip
        if (!body.includes('styles.') || body.includes('const styles =') || body.includes('const styles=')) return match;

        // Inject right after the opening brace
        return `${prefix}\n    const { theme, isDark } = useTheme();\n    const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);${body}`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched subcomponents in: ${filePath}`);
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
console.log('Starting subcomponent styles injection...');
walkDir(targetDir);
console.log('Done.');
