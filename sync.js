//Thanks, apsillers @ stackoverflow
function syncSet(key, objectToStore, callback) {
    var jsonstr = JSON.stringify(objectToStore);
    var i = 0;
    var storageObj = {};
    // split jsonstr into chunks and store them in an object indexed by `key_i`
    while(jsonstr.length > 0) {
        var index = key + "_" + i++;

        // since the key uses up some per-item quota, see how much is left for the value
        // also subtract two for the quotes added by stringification
        var maxValueLength = chrome.storage.sync.QUOTA_BYTES_PER_ITEM - index.length - 1024;

        var segment = jsonstr.substr(0, maxValueLength);
        storageObj[index] = segment;
        jsonstr = jsonstr.substr(maxValueLength);
    }
	
	console.log(storageObj);
    // store all the chunks
    chrome.storage.sync.set(storageObj, callback);
}

//Thanks kdzwinel @ github
function getCacheKey(key, i) {
		return key + "_" + i;
}
function syncGet(key, callback)
{
	chrome.storage.sync.get(null, function(items){
		if(chrome.runtime.lastError)
		{
			console.log(chrome.runtime.lastError);
			callback("");
			return;
		}
		var i;
		var value = "";

		for(i=0; i<chrome.storage.sync.MAX_ITEMS; i++) {
			if(items[getCacheKey(key, i)] === undefined) {
				break;
			}
			value += items[getCacheKey(key, i)];
		}
		callback(value);
	});
}