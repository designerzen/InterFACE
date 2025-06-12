const fs = require('fs').promises;
const path = require('path');
const fflate = require('fflate');

const waveTablesDir = path.join(__dirname, "../", 'source/assets/audio', 'wave-tables');

async function zipWavetableFolders() {
    try {
        console.log(`Scanning directory: ${waveTablesDir}`);
        const entries = await fs.readdir(waveTablesDir, { withFileTypes: true });

        for (const entry of entries) {
            if (entry.isDirectory()) {
                const subDirPath = path.join(waveTablesDir, entry.name);
                const zipFileName = `${entry.name}.zip`;
                const zipFilePath = path.join(waveTablesDir, zipFileName);

                console.log(`Processing directory: ${entry.name}`);

                try {
                    const filesInSubDir = await fs.readdir(subDirPath);
                    const jsonFiles = filesInSubDir.filter(file => path.extname(file).toLowerCase() === '.json');

                    if (jsonFiles.length === 0) {
                        console.log(`  No JSON files found in ${entry.name}, skipping.`);
                        continue;
                    }

                    const filesToZip = {};
                    for (const jsonFile of jsonFiles) {
                        const jsonFilePath = path.join(subDirPath, jsonFile);
                        try {
                            const content = await fs.readFile(jsonFilePath);
                            // Use relative path inside zip
                            filesToZip[jsonFile] = content;
                        } catch (readErr) {
                            console.error(`  Error reading file ${jsonFilePath}:`, readErr);
                        }
                    }

                    if (Object.keys(filesToZip).length > 0) {
                        console.log(`  Zipping ${Object.keys(filesToZip).length} JSON files into ${zipFileName}...`);
                        const zippedData = fflate.zipSync(filesToZip, { level: 9 }); // Use sync version for simplicity here, async is also available
                        await fs.writeFile(zipFilePath, zippedData);
                        console.log(`  Successfully created ${zipFilePath}`);
                    } else {
                        console.log(`  No files successfully read in ${entry.name}, skipping zip creation.`);
                    }

                } catch (subDirErr) {
                    console.error(`  Error processing directory ${subDirPath}:`, subDirErr);
                }
            }
        }
        console.log('Finished processing all directories.');
    } catch (err) {
        console.error('Error reading wave-tables directory:', err);
        process.exit(1); // Exit with error code
    }
}

zipWavetableFolders();