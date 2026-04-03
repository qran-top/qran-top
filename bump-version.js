import fs from 'fs';
import path from 'path';

const metadataPath = path.resolve(process.cwd(), 'metadata.json');

try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    const currentVersion = metadata.version || '1.0.0';
    
    // Simple version bumping: increment the last part of the version string
    const parts = currentVersion.split('.');
    if (parts.length > 0) {
        const lastPart = parseInt(parts[parts.length - 1], 10);
        if (!isNaN(lastPart)) {
            parts[parts.length - 1] = (lastPart + 1).toString();
        } else {
            parts.push('1');
        }
    } else {
        parts.push('1', '0', '0');
    }
    
    const newVersion = parts.join('.');
    metadata.version = newVersion;
    
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    console.log(`Successfully bumped version to ${newVersion} in metadata.json`);
} catch (error) {
    console.error('Failed to bump version in metadata.json:', error);
    process.exit(1);
}
