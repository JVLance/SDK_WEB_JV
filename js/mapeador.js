function mapeador (){
	
	this.datos = function(obj){
		this.data = (typeof obj != "object") ? false : obj;
		return this;
	}
	
	this.plantilla = function(cadena){
		this.template = (typeof cadena != "string") ? false : cadena;
		return this;
	}
	
	this.bind = function(elemento){
		this.elemento = (typeof elemento == "string") ? document.getElementById(elemento) : (typeof elemento == "object") ? elemento : false;
		this.mostrar();
		return this;
	}
	
	this.mostrar = function(retornar){
		retornar = (typeof(retornar) != 'undefined') ? retornar : false;
		if (!this.validar_inicializacion(retornar)){ return; }
		var cachetemplate = this.template;
		var etiquetas = cachetemplate.match(/(\{+[A-z.]+\})/g);
		for (var i = 0; i < etiquetas.length; i++){
			var valor = this.obtener_Valor(etiquetas[i]);
			if (!valor){
				this.error('Error: No existe el valor ' + etiquetas[i] + ' en el objeto especificado.');
				return false;
			}
			cachetemplate = cachetemplate.replace(etiquetas[i], valor);
		}
		if (retornar){
			return cachetemplate;
		}

		this.elemento.innerHTML = cachetemplate;
		return this;
	}
	
	this.obtener_Valor = function (cadena){
		cadena = (cadena.replace("}", "")).substr(1);
		if (cadena.indexOf('.') == -1){
			return (typeof this.data[cadena] != "undefined") ? this.data[cadena] : false;
		}
		
		var subelementos = cadena.split('.');
		return this.obtener_nodo(this.data, subelementos[0], subelementos, 1);
	}
	
	this.obtener_nodo = function (objeto, clave, resto, subclave){
		if (typeof resto[subclave] == "undefined"){
			return objeto[clave];
		}
		
		return this.obtener_nodo(objeto[clave], resto[subclave], resto, subclave + 1);
	}
	
	
	this.validar_inicializacion = function(retornar){
		if (!this.data){
			this.error('Error: No se ha definido los datos a mapear. Debe primero llamar a la función datos pasandole el objeto cuyos datos se imprimirán.');
			return false;
		}else if (!this.template){
			this.error('Error: No se ha definido el template para mostrar los datos. Debe primero llamar a la función plantilla pasandole dicho template.');
			return false;
		}else if (!this.elemento && !retornar){
			this.error('Error: El elemento del DOM sobre el que se pintará es invalido');
			return false;
		}
		
		return true;
	}
	
	this.error = function(error){
		try {
			console.log(error);
		} catch (e){
			alert(error);
		}
	}
}