
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const HEXO_POSTS_DIR = '_hexo_backup/source/_posts';
const HEXO_IMG_DIR = '_hexo_backup/source/img';
const TARGET_POSTS_DIR = 'content/posts';
const TARGET_ASSETS_DIR = 'content/assets';

if (!fs.existsSync(TARGET_POSTS_DIR)) fs.mkdirSync(TARGET_POSTS_DIR, { recursive: true });
if (!fs.existsSync(TARGET_ASSETS_DIR)) fs.mkdirSync(TARGET_ASSETS_DIR, { recursive: true });

function copyGlobalAssets() {
    if (fs.existsSync(HEXO_IMG_DIR)) {
        const files = fs.readdirSync(HEXO_IMG_DIR);
        files.forEach(file => {
            const src = path.join(HEXO_IMG_DIR, file);
            const dest = path.join(TARGET_ASSETS_DIR, file);
            if (fs.statSync(src).isFile()) {
                fs.copyFileSync(src, dest);
                console.log(`Copied global asset: ${file}`);
            }
        });
    }
}

function processContent(content, postSlug) {
    let newContent = content;

    newContent = newContent.replace(/\{%\s*post_link\s+([^\s]+)\s*(.*?)%\}/g, (match, title, text) => {
        text = text.trim();
        return text ? `[[${title}|${text}]]` : `[[${title}]]`;
    });

    newContent = newContent.replace(/\{%\s*asset_img\s+([^\s]+)\s*(.*?)%\}/g, (match, filename, alt) => {
        alt = alt.trim();
        return `![${alt}](../../assets/${postSlug}/${filename})`;
    });

    newContent = newContent.replace(/\]\(\/img\//g, '](../../assets/');
    newContent = newContent.replace(/src="\/img\//g, 'src="../../assets/');

    return newContent;
}

function migratePosts() {
    const files = fs.readdirSync(HEXO_POSTS_DIR);
    
    files.forEach(file => {
        const filePath = path.join(HEXO_POSTS_DIR, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const targetAssetDir = path.join(TARGET_ASSETS_DIR, file);
            if (!fs.existsSync(targetAssetDir)) fs.mkdirSync(targetAssetDir, { recursive: true });
            
            const assetFiles = fs.readdirSync(filePath);
            assetFiles.forEach(asset => {
                 const assetSrc = path.join(filePath, asset);
                 const assetDest = path.join(targetAssetDir, asset);
                 if (fs.statSync(assetSrc).isFile()) {
                     fs.copyFileSync(assetSrc, assetDest);
                 }
            });
            console.log(`Moved assets for: ${file}`);

        } else if (file.endsWith('.md')) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const parsed = matter(fileContent);
            const data = parsed.data;
            
            if (data.categories) {
                if (!data.tags) data.tags = [];
                const cats = Array.isArray(data.categories) ? data.categories : [data.categories];
                const flatCats = cats.flat(); 
                data.tags = [...new Set([...(data.tags || []), ...flatCats])];
                delete data.categories;
            }

            if (data.cover && data.cover.startsWith('/img/')) {
                 data.cover = data.cover.replace('/img/', '../../assets/');
            }
            
            delete data.top;
            delete data.abbrlink;
            delete data.sticky;

            const postSlug = path.parse(file).name;
            const newBody = processContent(parsed.content, postSlug);
            const newFileContent = matter.stringify(newBody, data);
            
            fs.writeFileSync(path.join(TARGET_POSTS_DIR, file), newFileContent);
            console.log(`Migrated post: ${file}`);
        }
    });
}

console.log('Starting migration...');
copyGlobalAssets();
migratePosts();
console.log('Migration complete.');
