console.info('test');

function yaml2json(content) {
    var dump = jsyaml.dump(content, {lineWidth: 160});
    dump = dump.replace(/(- \w+:) null/g, '$1');
    dump = dump.split("\n").filter((x) => x.indexOf('!<tag:yaml.org,2002:js/undefined>') === -1).join("\n");
    return dump;
}

function editLandscapeYml(content) {
    const items = [];
    for (var category of content.landscape) {
        for (var subcategory of category.subcategories) {
	    for (var item of subcategory.items) {
	        items.push({
		    category: category.name,
		    subcategory: subcategory.name,
		    id: `${category.name}:${subcategory.name}:${item.name}`,
		    ...item
		});
	    }
	}
    }
    console.info(items);
    

    const allowedKeys = [
	'name',
	'homepage_url',
	'logo',
	'twitter',
	'crunchbase',
	'repo_url',
	'project_org',
	'additional_repos',
	'stock_ticker',
	'description',
	'branch',
	'project',
	'url_for_bestpractices',
	'enduser',
	'open_source',
	'allow_duplicate_repo',
	'unnamed_organization',
	'organization',
	'joined',
	'extra'
    ];
    const fields = ['category', 'subcategory', 'id', 'item', ...allowedKeys];

    const store = new Ext.data.JsonStore({
        fields: fields
    });

    store.loadData(items);

    const grid = new Ext.grid.Panel({
	region: 'center',
	store: store,
	columns: [{
	    text: 'Category',
	    dataIndex: 'category',
	    width: 150
	}, {
	    text: 'Subcategory',
	    dataIndex: 'subcategory',
	    width: 150
	}, {
	    text: 'Name',
	    dataIndex: 'name',
	    width: 150
	}, {
	    text: 'Crunchbase',
	    dataIndex: 'crunchbase',
	    renderer: (x) => x.replace('https://www.crunchbase.com/organization/', ''),
	    width: 150
	}]
    });

    const onUpdateEntry = function() {
       const item = sm.getSelection()[0];
       const assign = function(name) {
	   var value = editor.down(`[name=${name}]`).getValue();
	   if (value === "null") {
              value = null;
	   }
	   item.set(name, value);
       }
       assign('name');
       assign('homepage_url');
       assign('logo');
       assign('twitter');
       assign('crunchbase');
       assign('repo_url');
       assign('project_org');
       assign('additional_repos');
       assign('stock_ticker');
       assign('description');
       assign('branch');
       assign('project');
       assign('url_for_bestpractices');
       assign('enduser');
       assign('organization');
       assign('joined');
    }

    const editor = new Ext.Panel({
        title: 'Edit selected item',
	layout: 'form',
	width: 500,
	region: 'east',
	defaults: {
            width: 200
	},
	items: [{
	    xtype: 'textfield',
	    name: 'name',
	    fieldLabel: 'Name:',
	    description: 'A name of the item, should be unique'
	}, {
	    xtype: 'textfield',
	    name: 'logo',
	    fieldLabel: 'Logo:',
	    qtip: 'Logo',
	    description: 'A path to an svg file inside a host_logos folder'
	}, {
	    xtype: 'textfield',
	    name: 'homepage_url',
	    fieldLabel: 'Homepage url:',
	    description: 'A full link to the homepage'
	}, {
	    xtype: 'textfield',
	    name: 'twitter',
	    fieldLabel: 'Twitter',
	    description: 'Link to a working twitter. Should contain at least one tweet'
	}, {
	    xtype: 'textfield',
	    name: 'crunchbase',
	    fieldLabel: 'Crunchbase',
	    description: 'A full url to the crunchbase entry. Allows to fetch additional information about the organization responsible for the entry'
	}, {
	    xtype: 'textfield',
	    name: 'repo_url',
	    fieldLabel: 'Github repo url',
	    description: 'A full url to the github repository'
	}, {
	    xtype: 'textfield',
	    name: 'project_org',
	    fieldLabel: 'project_org',
	    description: 'When a project belongs to multiple repositories, please provide this field'
	}, {
	    xtype: 'textfield',
	    name: 'additional_repos',
	    fieldLabel: 'Additional repos',
	    description: 'Extra repositories to calculate stars and other statistic'
	}, {
	    xtype: 'textfield',
	    name: 'stock_ticker',
	    fieldLabel: 'Stock ticker',
	    description: 'Allows to overrid a stock ticker when a stock ticker from a crunchbase is not correct'
	}, {
	    xtype: 'textarea',
	    name: 'description',
	    fieldLabel: 'Description',
	    description: 'Provide a description to the filed here, if the one from the crunchbase is not good enough'
	}, {
	    xtype: 'textfield',
	    name: 'branch',
	    fieldLabel: 'branch',
	    description: 'A branch on a github when a default one is not suitable'
	}, {
	    xtype: 'textfield',
	    name: 'project',
	    fieldLabel: 'project',
	    description: 'Which internal project this entry belongs to'
	}, {
	    xtype: 'textfield',
	    name: 'url_for_bestpractices',
	    fieldLabel: 'url_for_bestpractices',
	    description: 'When a project follows best practices, please provide an url here.'
	}, {
	    xtype: 'textfield',
	    name:  'enduser',
	    fieldLabel: 'enduser'
	}, {
	    xtype: 'checkbox',
	    name: 'open_source',
	    boxLabel: 'open_source'
	}, {
	    xtype: 'checkbox',
	    name: 'allow_duplicate_repo',
	    boxLabel: 'allow_duplicate_repo'
	}, {
	    xtype: 'checkbox',
	    name: 'unnamed_organization',
	    boxLabel: 'unnamed_organization'
	}, {
	    xtype: 'checkbox',
	    name: 'unnamed_organization',
	    boxLabel: 'unnamed_organization'
	}, {
	    xtype: 'textfield',
	    name: 'organization',
	    fieldLabel: 'organization'
	}, {
	    xtype: 'textfield',
	    name: 'joined',
	    fieldLabel: 'joined'
	}, {
	    xtype: 'panel',
	    text: 'Selected Field Information',
	    width: '100%',
	    height: 100,
	    layout: 'fit',
	    items: [{ xtype: 'box' }]
	}, {
	    xtype: 'box',
	    height: 20
	}, {
	    xtype: 'button',
	    text: 'Update entry',
	    scale: 'medium',
	    handler: onUpdateEntry
	}]
    });

    editor.on('afterrender', function() {
	const fields = editor.query('[name]');
	const panel = editor.down('[xtype=panel]');
	for (var item of fields) {
	    const updateDescription = function(item) {
	        panel.setTitle('Info: ' + item.name);
		panel.down('[xtype=box]').update(item.description || 'No description')
	    }
	    item.on('focus', updateDescription);
	    item.on('mouseover', updateDescription);
	}
    });

    const sm = grid.getSelectionModel();

    async function saveChanges() {
        const rows = store.getRange();
	for (var category of content.landscape) {
	    for (var subcategory of category.subcategories) {
	        for (var item of subcategory.items) {
		    const id = `${category.name}:${subcategory.name}:${item.name}`
		    const data = rows.filter( (x) => x.get('id') === id)[0];

		    for (var key of allowedKeys) {
		        const value = data.get(key);
			if (value !== '') {
                           item[key] = value;
			} else {
                           delete item[key];
			}
		    }

		}
	    }
	}
	const yml = yaml2json(content);
        const fileHandle = await webFolder.getFileHandle('landscape.yml');
	const stream = await fileHandle.createWritable();
	await stream.write(yml);
	await stream.close();

	wnd.close();
    }

    const bottom = new Ext.Panel({
        layout: 'absolute',
	height: 50,
	region: 'south',
	items: [{
	    xtype: 'button',
	    scale: 'medium',
	    text: 'Save settings.yml',
	    x: 5,
	    y: 5,
	    handler: saveChanges
	}, {
	    xtype: 'button',
	    text: 'Cancel',
	    x: 1005,
	    y: 5,
	    handler: function() {
                wnd.close();
	    }
	}]
    });

    const wnd = new Ext.Window({
        title: 'landscape.yml online editor',
	layout: 'border',
	items: [grid, editor, bottom],
	width: 1124,
	height: 818
    });
    wnd.show();

    sm.on('selectionchange', function() {
	checkSelection();
    });
    function checkSelection() {
        const item = sm.getSelection()[0];
	const data = item.data;
	if (!item) {
	  editor.hide();
	} else {
	    editor.show();
	    const assign = function(name) {
		let value = item.get(name);
		if (value === null) {
		    value = "null";
		}
		editor.down(`[name=${name}]`).setValue(value);
	    }
	    assign('name');
	    assign('homepage_url');
	    assign('logo');
	    assign('twitter');
	    assign('crunchbase');
	    assign('repo_url');
	    assign('project_org');
	    assign('additional_repos');
	    assign('stock_ticker');
	    assign('description');
	    assign('branch');
	    assign('project');
	    assign('url_for_bestpractices');
	    assign('enduser');
	    assign('open_source');
	    assign('allow_duplicate_repo');
	    assign('unnamed_organization');
	    assign('organization');
	    assign('joined');
	}
    }

}

async function collectAllFiles() {
    const files = {};
    const landscapeFiles = ['settings.yml', 'landscape.yml', 'processed_landscape.yml'];
    const landscapeFolders = ['images', 'cached_logos', 'hosted_logos'];
    for (var file of landscapeFiles) {
        const handle = await webFolder.getFileHandle(file);
        const fileObj = await handle.getFile();
        const content = await fileObj.text();
        files[file] = {
            file,
            content,
            lastModified: fileObj.lastModified
        }
    }

    await Promise.all(landscapeFolders.map(async folder => {
        const dirHandle = await webFolder.getDirectoryHandle(folder);
        for await (const entry of dirHandle.values()) {
            const file = entry.name;
            const handle = await dirHandle.getFileHandle(file);
            const fileObj = await handle.getFile();
            const content = await fileObj.text();
            files[`${folder}/${file}`] = {
                file: `${folder}/${file}`,
                content,
                lastModified: fileObj.lastModified
            };
        }
    }));
    return files;
}

// 
async function getChangedFiles(lastSnapshot) {
    const files = {};
    const existingFiles = {}; // to mark deleted files
    const landscapeFiles = ['settings.yml', 'landscape.yml', 'processed_landscape.yml'];
    const landscapeFolders = ['images', 'cached_logos', 'hosted_logos'];

    for (var file of landscapeFiles) {
        const handle = await webFolder.getFileHandle(file);
        const fileObj = await handle.getFile();
        const existingEntry = (lastSnapshot[file] || {});
        existingFiles[file] = true;
        if (existingEntry.lastModified !== fileObj.lastModified) {
            const content = await fileObj.text();
            files[file] = {
                file,
                content,
                lastModified: fileObj.lastModified
            }
        }
    }

    for (var folder of landscapeFolders) {
        const dirHandle = await webFolder.getDirectoryHandle(folder);
        for await (const entry of dirHandle.values()) {
            const file = entry.name;
            const handle = await dirHandle.getFileHandle(file);
            const fileObj = await handle.getFile();
            const existingEntry = (lastSnapshot[`${folder}/${file}`] || {});
            existingFiles[`${folder}/${file}`] = true;
            if (existingEntry.lastModified !== fileObj.lastModified) {
                const content = await fileObj.text();
                files[`${folder}/${file}`] = {
                    file: `${folder}/${file}`,
                    content,
                    lastModified: fileObj.lastModified
                };
            }
        }
    }

    const removedFiles = Object.values(lastSnapshot).filter( (entry) => !existingFiles[entry.file] ).map( (entry) => ({ file: entry.file, isDeleted: true}));

    return Object.values(files).concat(removedFiles);
}


function init() {
    Ext.QuickTips.enable();
    const tmpDiv = document.createElement('div');
    document.body.appendChild(tmpDiv);
    tmpDiv.outerHTML = `
        <div id="main" style="height: 100%;">
            <div style="height: 40px; background: #ddd;">
                <span style="font-size: 24px;"><b>yarn fecth demo</b></span>
                <input id="dir" type="button" value="1. Select folder with a landscape"></input>
                <input id="run" type="button" value="2. Run yarn fetch"></input>
                <input id="server" type="button" value="3. Run yarn dev"></input>
                <input id="landscapeyml" type="button" value="Edit landscape.yml"></input>
                <span id="overlay-wrapper"><input id="overlay" type="checkbox" checked></input><label for="overlay">Show Overlay</label></span>
                <a href="/landscape" target="_blank">View Landscape</a>
                <div id="status" style="display: inline-block; font-weight: bold;"></div>
            </div>
            <div style="height: calc(100% - 60px); position: relative;">
                <div class="output" id="output-fetch" style="position: absolute; z-index: 100; width: 30%; height: 60%; left: 0; top: 10%">
                  <div class="switch">+</div>
                  <div><b>yarn fetch</b> output</div>
                </div>
                <div class="output" id="output-dev" style="position: absolute; z-index: 100; width: 30%; height: 60%; left: 70%; top: 10%;">
                  <div class="switch">+</div>
                  <div><b>yarn dev</b> output</div>
                </div>
                <iframe id="iframe" style="border: 0; position: absolute; z-index: 1; width: 100%; height: 100%; left: 0; top: 0;"></iframe>
            </div>
        </div>
    `;
    const mainDiv = document.querySelector('#main');

    function disableButtons() {
        dirButton.disabled = true;
        inputButton.disabled = true;
        serverButton.disabled = true;
    }
    function enableButtons() {
        dirButton.disabled = false;
        inputButton.disabled = false;
        serverButton.disabled = false;
    };

    const ws = new WebSocket(window.location.href.replace('http', 'ws'));
    ws.onmessage = async function(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'id') {
            window.socketId = data.id;
            console.info(`Socket: ${data.id}`);
        }
        if (data.type === 'message') {
            const textEl = document.createElement('span');
            textEl.innerText = data.text;
            const outputDiv = data.target === 'fetch' ? outputFetchDiv : outputDevDiv;
            outputDiv.appendChild(textEl);
            if (data.target === 'fetch') {
                statusDiv.innerText = `Fetching data`;
            }
        }
        if (data.type === 'finish') {
            statusDiv.innerText = `Waiting for updated files`;
        }
        if( data.type === 'files') {
            statusDiv.innerText = `Got files to update : ${data.files.length}`;
            for (let entry of data.files) {
                const parts = entry.file.split('/');
                const { dirHandle, fileHandle } = await (async function() {
                    if (parts.length === 1) {
                        const fileHandle = await webFolder.getFileHandle(parts[0]);
                        return {fileHandle, dirHandle: webFolder };
                    } else {
                        const dirHandle = await webFolder.getDirectoryHandle(parts[0]);
                        const fileHandle =  await dirHandle.getFileHandle(parts[1], { create: true});
                        return {fileHandle, dirHandle };
                    }
                })(); 
                if (entry.isDeleted) {
                    dirHandle.removeEntry(entry.file.split('/').slice(-1)[0]);
                    console.info('file deleted! ', entry.file);
                } else {
                    const stream = await fileHandle.createWritable();
                    await stream.write(entry.content);
                    await stream.close();
                    console.info('file saved! ', entry.file);
                }
            }
            statusDiv.innerText = `Fetch finished. ${data.files.length} files updated`;
            serverButton.disabled = false;
            window.allFiles = await collectAllFiles();
            enableButtons();
        }
    };

    const inputButton = mainDiv.querySelector('#run');
    const serverButton = mainDiv.querySelector('#server');
    const landscapeYmlButton = mainDiv.querySelector('#landscapeyml');
    const dirButton = mainDiv.querySelector('#dir');
    const outputFetchDiv = mainDiv.querySelector('#output-fetch');
    const outputDevDiv = mainDiv.querySelector('#output-dev');
    const statusDiv = mainDiv.querySelector('#status');
    const landscapeLink = mainDiv.querySelector('a');
    const iframeTag = mainDiv.querySelector('iframe');
    const overlayWrapper = mainDiv.querySelector('#overlay-wrapper');

    overlayWrapper.style.display = "none";
    inputButton.disabled = true;
    serverButton.disabled = true;
    landscapeLink.style.visibility = "hidden";
    iframeTag.style.opacity = 0;





    inputButton.addEventListener('click', async function() {
        disableButtons();
        statusDiv.innerText = `Collecting local files`;
        const files = await collectAllFiles();
        window.allFiles = files;
        statusDiv.innerText = `Uploading local files`;
        await fetch('api/fetch', {
            body: JSON.stringify({ socketId: socketId, files: Object.values(files)}),
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            }
        });
        statusDiv.innerText = `Waiting for response from the server`;
        // overlayWrapper.querySelector('input').checked = true;
        // updateOverlayVisibility();
        outputFetchDiv.classList.remove('collapsed');
    });

    function listenForFileChanges() {
        const fn = async function() {
            if (!window.allFiles) {
                return;
            }
            console.time('changes');
            const changedFiles = await getChangedFiles(window.allFiles);
            console.timeEnd('changes');
            console.info(changedFiles);
            if (changedFiles.length > 0) {
                statusDiv.innerText = `Uploading local file changes`;
                const files = await collectAllFiles();
                window.allFiles = files;
                await fetch('api/upload', {
                    body: JSON.stringify({ socketId: socketId, files: Object.values(files)}),
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json' 
                    }
                });
                statusDiv.innerText = `Changes uploaded`;
            }
            setTimeout(fn, 1000);
        };
        if (!window.changesTimerSet) {
            window.changesTimerSet = true;
            fn();
        }
    }

    serverButton.addEventListener('click', async function() {
        disableButtons();
        statusDiv.innerText = `Collecting local files`;
        const files = await collectAllFiles();
        window.allFiles = files;
        statusDiv.innerText = `Uploading local files and starting a dev server`;
        await fetch('api/server', {
            body: JSON.stringify({ socketId: socketId, files: Object.values(files) }),
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            }
        });
        statusDiv.innerText = `Dev server started`;
        enableButtons();
        landscapeLink.style.visibility = "";
        listenForFileChanges();
        serverButton.style.visibility = "hidden";
        iframeTag.src = "/landscape";
        iframeTag.style.opacity = 1;
        overlayWrapper.style.display = "";
        // outputFetchDiv.classList.add('overlay');
        // outputDevDiv.classList.add('overlay');
        outputDevDiv.classList.remove('collapsed');
    });

    landscapeYmlButton.addEventListener('click', async function() {
        const handle = await webFolder.getFileHandle('landscape.yml');
        const fileObj = await handle.getFile();
        const landscapeYmlContent = await fileObj.text();
	const content = jsyaml.load(landscapeYmlContent);
	console.info(content);

	editLandscapeYml(content);

    });

    function updateOverlayVisibility() {
        const isChecked = overlayWrapper.querySelector('input').checked;
        outputFetchDiv.style.visibility = isChecked ? "" : "hidden";
        outputDevDiv.style.visibility = isChecked ? "" : "hidden";
    }

    overlayWrapper.querySelector('input').addEventListener('click', updateOverlayVisibility);
    overlayWrapper.querySelector('input').addEventListener('change', updateOverlayVisibility);

    dirButton.addEventListener('click', async function() {
        window.webFolder = await window.showDirectoryPicker();
        const permission = await webFolder.requestPermission({mode: 'readwrite'});
        if (permission !== 'granted') {
            console.info('Permission to the folder was not provided');
        }
        enableButtons();
    });

    outputDevDiv.querySelector('.switch').addEventListener('click', function() {
        outputDevDiv.classList.toggle('collapsed');
    });
    outputFetchDiv.querySelector('.switch').addEventListener('click', function() {
        outputFetchDiv.classList.toggle('collapsed');
    });
}

window.addEventListener('DOMContentLoaded', init);
window.getChangedFiles = getChangedFiles;
window.collectAllFiles = collectAllFiles;
