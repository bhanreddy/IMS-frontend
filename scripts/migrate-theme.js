const fs = require('fs');
const path = require('path');

// Colors to replace with theme values
const colorMap = {
    // Backgrounds
    '\'#fff\'': 'theme.colors.background',
    '\'#FFFFFF\'': 'theme.colors.background',
    '"#fff"': 'theme.colors.background',
    '"#FFFFFF"': 'theme.colors.background',
    '\'white\'': 'theme.colors.background',
    '"white"': 'theme.colors.background',
    '\'#F3F4F6\'': 'theme.colors.card',
    '"#F3F4F6"': 'theme.colors.card',
    '\'#F9FAFB\'': 'theme.colors.card',
    '"#F9FAFB"': 'theme.colors.card',

    // Texts
    '\'#333\'': 'theme.colors.text',
    '"#333"': 'theme.colors.text',
    '\'#000\'': 'theme.colors.text',
    '"#000"': 'theme.colors.text',
    '\'black\'': 'theme.colors.text',
    '"black"': 'theme.colors.text',
    '\'#666\'': 'theme.colors.textSecondary',
    '"#666"': 'theme.colors.textSecondary',
    '\'#4B5563\'': 'theme.colors.textSecondary',
    '"#4B5563"': 'theme.colors.textSecondary',
    '\'#6B7280\'': 'theme.colors.textSecondary',
    '"#6B7280"': 'theme.colors.textSecondary',
    '\'#9CA3AF\'': 'theme.colors.textTertiary',
    '"#9CA3AF"': 'theme.colors.textTertiary',

    // Borders
    '\'#E5E7EB\'': 'theme.colors.border',
    '"#E5E7EB"': 'theme.colors.border',
    '\'#D1D5DB\'': 'theme.colors.border',
    '"#D1D5DB"': 'theme.colors.border',

    // Accents (Primary)
    '\'#3a1c71\'': 'theme.colors.primary',
    '"#3a1c71"': 'theme.colors.primary',
    '\'#4F46E5\'': 'theme.colors.primary',
    '"#4F46E5"': 'theme.colors.primary',
};

// Files & directories to ignore
const IGNORE_LIST = [
    '_layout.tsx',
    '+html.tsx',
    '+not-found.tsx',
    'index.tsx', // usually a dispatcher
    'settings.tsx', // already done manually
    'aiChat.tsx'    // often very complex, better manual
];

function getRelativePathToHooks(filePath) {
    const depth = filePath.split(path.sep).length - 2; // -1 for 'testapp', -1 for file itself
    // Very coarse approximation. Let's strictly calculate from 'app'

    // filePath Example: app/Screen/dashboard.tsx
    const parts = filePath.split(/[\\/]/);
    const appIndex = parts.indexOf('app');

    if (appIndex === -1) return '@/src/hooks/useTheme'; // fallback to alias

    const nestingLevel = parts.length - appIndex - 2;
    let prefix = '';

    if (nestingLevel === 0) {
        prefix = '../src';
    } else if (nestingLevel === 1) {
        prefix = '../../src';
    } else if (nestingLevel === 2) {
        prefix = '../../../src';
    } else {
        prefix = '@/src'; // Fallback to alias if deep
    }

    return `${prefix}/hooks/useTheme`;
}

function getRelativePathToThemes(filePath) {
    // Just using the same logic and appending theme
    const hookPath = getRelativePathToHooks(filePath);
    return hookPath.replace('hooks/useTheme', 'theme/themes');
}


function processFile(filePath) {
    const filename = path.basename(filePath);
    if (IGNORE_LIST.includes(filename)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Check if StyleSheet exists. If not, maybe skip to avoid polluting simple components.
    if (!content.includes('StyleSheet.create')) {
        return;
    }

    // 2. Add imports if they don't exist
    if (!content.includes('useTheme')) {
        const importHook = `import { useTheme } from '${getRelativePathToHooks(filePath)}';\n`;
        const importTheme = `import { Theme } from '${getRelativePathToThemes(filePath)}';\n`;

        // Find last import
        const importRegex = /^import .+?;?$/gm;
        let lastImportIndex = 0;
        let match;
        while ((match = importRegex.exec(content)) !== null) {
            lastImportIndex = match.index + match[0].length;
        }

        if (lastImportIndex > 0) {
            content = content.slice(0, lastImportIndex) + '\n' + importHook + importTheme + content.slice(lastImportIndex);
        } else {
            content = importHook + importTheme + content;
        }
    }

    // 3. Inject Hook into default export component
    // Assuming pattern: export default function ComponentName() { 
    // or const ComponentName = () => {

    /* 
       This regex is tricky across random styles. Let's look for:
       export default function X() {
       or 
       const X = () => {
    */
    const componentRegex = /((?:export\s+default\s+)?(?:function|const)\s+[A-Za-z0-9_]+\s*(?:=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>|\([^)]*\))\s*(?::\s*React\.FC)?\s*\{)(?!\s*const \{ theme, isDark \})/m;

    if (componentRegex.test(content) && !content.includes('useTheme()')) {
        content = content.replace(componentRegex, `$1\n    const { theme, isDark } = useTheme();\n`);
    }

    // 4. Transform StyleSheet.create({ ... }) -> const getStyles = (theme: Theme, isDark: boolean) => StyleSheet.create({ ... })
    // and replace `const styles = StyleSheet.create` with `const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);`

    const styleSheetRegex = /const\s+styles\s*=\s*StyleSheet\.create\(\{([\s\S]+?)\}\);/g;

    if (styleSheetRegex.test(content)) {
        // Replace definition
        let stylesBlock = '';
        content = content.replace(styleSheetRegex, (match, inner) => {
            stylesBlock = `const getStyles = (theme: Theme, isDark: boolean) => StyleSheet.create({${inner}});`;
            return `const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);`;
        });

        // Ensure React is imported for useMemo
        if (!content.includes('import React')) {
            content = `import React from 'react';\n` + content;
        } else if (content.includes('import React') && !content.includes('useMemo') && !content.includes('React.useMemo')) {
            // we are injecting React.useMemo, so as long as React is imported, it works
        }

        // Append stylesBlock to end of file
        content += `\n\n${stylesBlock}\n`;
    }

    // 5. Replace colors inside `getStyles` ONLY
    // We isolate the getStyles block to avoid messing up other strings
    const getStylesRegex = /const getStyles = \([^)]+\) => StyleSheet\.create\(\{([\s\S]+?)\}\);/g;
    content = content.replace(getStylesRegex, (match, inner) => {
        let modifiedInner = inner;
        for (const [hex, themeVal] of Object.entries(colorMap)) {
            // Replace exact matches of the color string
            const hexRegex = new RegExp(hex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            modifiedInner = modifiedInner.replace(hexRegex, themeVal);
        }
        return `const getStyles = (theme: Theme, isDark: boolean) => StyleSheet.create({${modifiedInner}});`;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
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
console.log(`Starting migration on ${targetDir}`);
walkDir(targetDir);
console.log('Migration complete. Please dry-run compilation.');
