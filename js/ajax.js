 function ObjAJAX(){
	var obj;
	if (window.XMLHttpRequest) { // no es IE
		obj = new XMLHttpRequest();
	}
	else { // Es IE o no tiene el objeto
		try {
			obj = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch (e) {
		alert("Navegador no soportado");
		}
	}
  return obj;
}


function Najax(){
	this.obj = ObjAJAX();
	this.asynchronous = true;

	this.prepare = function (params){
		var keys = Object.keys(params);
		var limit = keys.length;
		var chain = '';
		for (i = 0; i < limit; i++){
			if (i > 0){
				chain += '&';
			}
			chain += keys[i] + '=' + escape(params[keys[i]]);
		}
		return chain;
	};
	
	this.connect = function(method, url, params, callback){
		this.obj.open(method, url, this.asynchronous);
		this.obj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		if (this.asynchronous){
			this.obj.onreadystatechange = function(){
				if (this.obj.readyState == 4) {
					callback(this.obj.responseText);
				}	
			};
			this.obj.send(params);
		}else{
			this.obj.send(params);
			return this.obj.responseText;
		}
	}
	
	this.get = function (url, params, callback){
		params = this.prepare(params);
		url = (params != '') ? url + '?' + params : url;
		return (typeof (callback) == "undefined") ? this.connect("GET", url, params) : this.connect("GET", url, params, callback);
	};
	
	this.post = function (url, params, callback){
		params = this.prepare(params);
		return (typeof (callback) == "undefined") ? this.connect("POST", url, params) : this.connect("POST", url, params, callback);
	};
	
	this.load_script = function (route, sType, oCallback){
		sType = sType || 'text/javascript';

		var oHead = document.getElementsByTagName('head')[0] || document.documentElement;
		var sScriptId = 'JaSper_script_' + route.replace(/[^a-zA-Z\d_]+/, '');

		if(!document.getElementById(sScriptId)){
			var oScript = document.createElement('script');
			oScript.setAttribute('id', sScriptId);
			oScript.setAttribute('type', sType);
			oScript.setAttribute('src', route);

			oScript.onload = oScript.onreadystatechange = function (){
				if(!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete'){
					oScript.onload = oScript.onreadystatechange = null;
					if (typeof(oCallback) != "undefined"){
						eval(oCallback);
					}

					if(oHead && oScript.parentNode){
						oHead.removeChild(oScript);
					}
				}
			};

			oHead.insertBefore(oScript, oHead.firstChild);
		}
		else{
			if (typeof(oCallback) != "undefined"){
				eval(oCallback);
			}
		}

		return true;
	};
	
	
}

var ajax = new Najax();

/* objeto para el cargado de datos por get y post */

function connector(url, params){
	this.url = (typeof (url) != "undefined") ? url : '';
	this.params = (typeof (params) != "undefined") ? params : {};
	this.response = {};
	this.get = function(params, callback){
		params = this.get_params(params);
		callback = this.get_callback(params, callback);
		if (callback == null){
			this.response = JSON.parse(ajax.get(this.url, params));
			return this.response;
		}else{
			ajax.get(this.url, params, callback);
		}
	}
	this.post = function(params, callback){
		params = this.get_params(params);
		callback = this.get_callback(params, callback);
		if (callback == null){
			this.response = JSON.parse(ajax.post(this.url, params));
			return this.response;
			
		}else{
			ajax.post(this.url, params, callback);
		}

	}

	this.get_params = function(params){
			return (typeof(params) != "undefined") && (typeof(params) != "function") ? params : this.params;
	}

	this.get_callback = function(params, callback){
		return (typeof(callback) != "undefined") ? callback : (typeof(params) == "function") ? params : null;
	}
}