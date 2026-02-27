const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

// Generate the AST for the two lines we want to inject
const injectedCode = `
const { theme, isDark } = useTheme();
const styles = React.useMemo(() => getStyles(theme, isDark), [theme, isDark]);
`;
const injectAst = parser.parse(injectedCode, { sourceType: 'module' }).program.body;

function processFile(filePath) {
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Only process files that declare getStyles since those are the styled ones 
    if (!content.includes('getStyles(theme: Theme, isDark: boolean)') && !content.includes('getStyles = (theme: Theme')) {
        return;
    }

    let ast;
    try {
        ast = parser.parse(content, {
            sourceType: 'module',
            plugins: ['jsx', 'typescript']
        });
    } catch (e) {
        console.warn(`Could not parse ${filePath}:`, e.message);
        return;
    }

    let changed = false;

    traverse(ast, {
        Function(pathNode) {
            // Check if styles is used inside
            let usesStyles = false;
            // Also check if useTheme is already used
            let hasThemeNode = false;

            pathNode.traverse({
                Identifier(idPath) {
                    if (idPath.node.name === 'styles' && !idPath.parentPath.isVariableDeclarator()) {
                        usesStyles = true;
                    }
                    if (idPath.node.name === 'useTheme' && idPath.parentPath.isCallExpression()) {
                        hasThemeNode = true;
                    }
                }
            });

            if (usesStyles) {
                // If the function already defines styles in its own scope, skip
                if (pathNode.scope.hasOwnBinding('styles')) return;

                // Make sure useTheme isn't already declared in the function block root
                // Wait, if hasThemeNode is true but not defining styles? We should define styles, but not useTheme.
                // For safety, let's just avoid if useTheme is already in this block.
                if (hasThemeNode) return;

                changed = true;

                // Ensure the function has a block body (e.g., arrow functions could have implicit bounds)
                if (!t.isBlockStatement(pathNode.node.body)) {
                    pathNode.get('body').replaceWith(
                        t.blockStatement([t.returnStatement(pathNode.node.body)])
                    );
                }

                // Inject the generated AST at the top of the block
                // We map over injectAst to clone the nodes
                const clonedNodes = injectAst.map(n => t.cloneNode(n, true));
                pathNode.get('body').unshiftContainer('body', clonedNodes);
            }
        }
    });

    if (changed) {
        const output = generate(ast, {}, content);
        fs.writeFileSync(filePath, output.code, 'utf8');
        console.log(`Babel-patched styles locally in: ${filePath}`);
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
console.log('Starting Babel AST styles injection...');
walkDir(targetDir);
console.log('Done.');
