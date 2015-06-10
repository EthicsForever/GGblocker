var allFilters;
var timeoutID =-1;
var disabled = false;
window.onload=function(){
	document.getElementById("goGG").addEventListener("click",gitGud);
	document.getElementById("addFilterButton").addEventListener("click",addURL);
	document.getElementById("goGoogleDev").addEventListener("click",goGoogle);
	document.getElementById("blockThis").addEventListener("click",blockThis);
	document.getElementById("editButton").addEventListener("click",editFilters);
	document.getElementById("archivePage").addEventListener("click",archivePage);
	document.getElementById("disableFiveButton").addEventListener("click",disableFive);
	chrome.runtime.getBackgroundPage(function(bg){
		disabled =bg.disabled;
		if(disabled){
			disableImage();
		}else{
			enableImage()
		}
	});
	chrome.runtime.onMessage.addListener(
	  function(request, sender, sendResponse) {
		disabled =false;
		enableImage();
	  });
};
//Thanks, Ethan Joachim Eldridge @ gitgud
function archivePage()
{
	chrome.tabs.query(
    {
      'active': true,   
      'windowId' : chrome.windows.WINDOW_ID_CURRENT
    }, 
    function(tabs){
      var tab = tabs[0];
      var url = tab.url;
      if(url.match(/twitter.com/)){
      setTimeout(function(){
        open('http://tweetsave.com/?tweet='+encodeURIComponent(url))
      },10)
      
    } 
    setTimeout(function(){
      open('https://archive.today/?run=1&url='+encodeURIComponent(url))  
    },10)
    });
}
function addURL()
{
	var pattern = 
	allFilters.push({"u":document.getElementById("addFilterUrl").value, "a":true});
	updateStorage();
	document.getElementById("addFilterUrl").value ="";
	document.getElementById("message").innerHTML ="Added!";
	setTimeout(function(){
		document.getElementById("message").innerHTML ="";
	},2000);
}
function blockThis()
{
  chrome.tabs.query(
    {
      'active': true,   
      'windowId' : chrome.windows.WINDOW_ID_CURRENT
    }, 
    function(tabs){
      var tab = tabs[0];
      var url = tab.url;
	  var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
	  var domain = matches && matches[1];
	  if(domain != null)
	  {
		document.getElementById("addFilterUrl").value = "*://*."+domain+"/*";
	  }
	  console.log(domain);
	}
   );
}
function goGoogle()
{
	chrome.tabs.create({url: "https://developer.chrome.com/extensions/match_patterns"});
}
function gitGud()
{
	chrome.tabs.create({url: "http://gitgud.net/groups/gamergate"});
}
function doItemThings(fItems){
			console.log(0);
			if(typeof fItems ==='undefined')
			{
			console.log(1);
				document.getElementById("editF").innerHTML="Error. DENTON!!!";
				document.getElementById("editF").style.display ="block";
				return;
			}
			fItems.trim();
			if(fItems.length ===0)
			{
			    console.log(2);
				document.getElementById("editF").innerHTML="Error. Nick must be up to something...";
				document.getElementById("editF").style.display ="block";
				return;
			}
			console.log(3);
			fItems = JSON.parse(fItems);
			allFilters =fItems;
			console.log(fItems);
			populateEdit(fItems);
			document.getElementById("editF").style.display ="block";
}
function editFilters()
{
	document.getElementById("home").style.display ="none";
	chrome.runtime.getBackgroundPage(function(bg){
		bg.syncGet("customFilter", doItemThings);
	});
	
}
function populateEvents(filters)
{
	for(var i=0;i < filters.length;i++)
	{
		var x=document.getElementById("filter_"+i+"_url");
		x.setAttribute("filterID",i);
		x.addEventListener("blur",filterBlur);
		var y=document.getElementById("filter_"+i+"_active");
		y.setAttribute("filterID",i);
		y.addEventListener("click",filterActive);
	}
}
function populateEdit(filters)
{
	var toReturn ="";
	for(var i=0;i<filters.length;i++)
	{
		toReturn += "<tr>"+buildForm(filters[i],i)+"</tr>";
	}
	document.getElementById("editFList").innerHTML="<table><thead><tr><th>Filter ID</th><th>Filter Pattern</th><th>Active</th></thead><tbody>"+toReturn+"</tbody></table>";
	populateEvents(filters);
}
function updateStorage()
{
	console.log("Attempting to update storage");
	chrome.runtime.getBackgroundPage(function(bg){
		bg.syncSet("customFilter",allFilters, function(){ bg.refreshActiveFilter(allFilters);});
	});
}
function filterActive(event)
{
	var filterID = event.target.getAttribute("filterID");
	var filterCheckbox = event.target;
	if(allFilters[filterID].a !== filterCheckbox.checked)
	{
		allFilters[filterID].a = filterCheckbox.checked;
		if(filterCheckbox.checked){
				document.getElementById("filter_"+filterID+"_url").className = "activeFilter";
		}else{
				document.getElementById("filter_"+filterID+"_url").className = "disabledFilter";
		}
		
		
		updateStorage();
		
	}
}
function filterBlur(event)
{
	var filterID = event.getAttribute("filterID");
	var filterTextbox = event.target;
	if(allFilters[filterID].u !== filterTextbox.value)
	{
		allFilters[filterID].u = filterTextbox.value;
		updateStorage();
		
	}
}
function buildForm(filter,id)
{
	var c ='disabledFilter';
	var checked = "";
	if(filter.a)
	{
		c='activeFilter';
		checked ="checked";
	}
	var toReturn ="<td>"+id+"</td><td><input id='filter_"+id+"_url' class='"+c+"' type='text' value='"+filter.u+"' /></td>";
	toReturn += "<td><input id='filter_"+id+"_active' type='checkbox' "+checked + " /></td>";
	return toReturn;
}
function disableFive()
{
    if(!disabled)
	{
		chrome.runtime.getBackgroundPage(function(bg){
			bg.disableFive();
		});
		disabled=true;
		disableImage();
	}
	else{
		enableFilter();
	}	
}
function disableImage()
{
	document.getElementById("disableFiveButton").setAttribute("src","playIcon.png");
	document.getElementById("disableText").innerHTML = "Enable Blocker";
}
function enableImage()
{
	document.getElementById("disableFiveButton").setAttribute("src","disableIcon.png");
	document.getElementById("disableText").innerHTML = "Disable Blocker";
}
function enableFilter()
{
	disabled =false;
	chrome.runtime.getBackgroundPage(function(bg){
		bg.enableFilter();
	});
	enableImage();
}