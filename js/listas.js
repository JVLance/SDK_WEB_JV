function listas(){
    this.header = "";
    this.footer = "";
    this.mapeador = new mapeador();
    this.datos = this.mapeador.datos;
    this.plantilla = this.mapeador.plantilla;

    this.cabecera = function(header){
        this.header = header;
        return this;
    }

    this.pie = function(footer){
        this.footer = footer;
        return this;
    }

    this.bind = function(elemento){
		this.elemento = (typeof elemento == "string") ? document.getElementById(elemento) : (typeof elemento == "object") ? elemento : false;
		this.listar();
		return this;
    }
    
    this.listar = function(){
        if (!this.validar_listado()){ return;}
        var cachetemplate = this.header;
        this.mapeador.plantilla(this.template);
        for (var i = 0; i < this.data.length; i++){
            cachetemplate += this.mapeador.datos(this.data[i]).mostrar(true);
        }
        cachetemplate += this.footer;
        this.elemento.innerHTML = cachetemplate;
    }



    this.validar_listado = function(){
        if (this.data.length > 0){
            return true;
        }

        this.mapeador.error("El listado recibido no es valido"); 
        return false;
    }
}