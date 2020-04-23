import './FONT_FACES.css'
import {FONT_FAMILIES_STYLES} from './FONT_FAMILIES_STYLES'

export const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"ANTQ", "Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
    TestColor: {
        color: '#FF4422'
    },
    ...FONT_FAMILIES_STYLES
};

/*
const fs = require('fs');
*/

/*
async function print(path) {
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
        let [name, type]=dirent.name.split('.');
        console.log(`@font-face {
            font-family: '${name}';
            src: url(/public/fonts/${name}.TTF) format('truetype');
        }`);
    }
}
print('C:\\Users\\username\\IdeaProjects\\workreact\\public\\fonts').catch(console.error);*/


/*
async function print(path) {
    const dir = await fs.promises.opendir(path);
    for await (const dirent of dir) {
        let [name, type]=dirent.name.split('.');
        console.log(`${name}_FONT_FAMILY: {
        fontFamily: '"${name}", sans-serif',
    },`);
    }
}
print('C:\\Users\\username\\IdeaProjects\\workreact\\public\\fonts').catch(console.error);*/
