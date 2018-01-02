/*
* ------------------------------------------------------- LIBRAIRIE javascript pluma1 ------------------------------------------
*
*
*/
var pluma1 = {
};
/*
*   ----- ajax : Gestion HtttRequest
*
*	@rubrique String uri 	: url
*	@rubrique fcallback		: fonction à exécuter sur onreadystate.
*							  	format : fcallback(xmlhttp.responseText)  
*	
*/
pluma1.ajax = {
  uri: '',
  fcallback: null,
  /* fonction : httpRequest(method,formData)
	*
	*	@param String method 		: GET ou POST
	*	@param formData 			: données à transmettre en POST ou GET ; sinon null
	*/
  httpRequest: function (method, formData) {
    var xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } 
    else { // code for IE6, IE5
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }    //sur réponse : appel de la fonction fcallback

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        fcall = pluma1.ajax.fcallback;
        fcall(xmlhttp.responseText);
      }
    }    //send

    xmlhttp.open(method, this.uri, true);
    xmlhttp.send(formData);
  },
  /* fonction : uploadOneFile(fileId)
	*
	*	@param String fileId 		: identifiant de l'élément type = 'file'
	*/
  uploadOneFile: function (fileId) {
    // Get the selected files from the input.
    var fileSelect = document.getElementById(fileId);
    var files = fileSelect.files;
    if (files.length == 0) {
      alert('Veuillez sélectionner un fichier...');
      return false;
    }    // Create a new FormData object.

    var formData = new FormData();
    //select file : Add the file to the request.
    var file = files[0];
    formData.append(fileId, file, file.name);
    this.httpRequest('POST', formData);
    return true;
  },
  /* fonction : displayInnerMethodGet(inner)
	*
	*	@param String inner 		: identifiant du inner
	*/
  displayInnerMethodGet: function (inner) {
    this.fcallback = function (responseText) {
      document.getElementById(inner).innerHTML = responseText;
    }
    this.httpRequest('GET', null);
  },
  end: 'end'
};
/*
*  ----- html : Gestion interaction HTML
* 
*	
*/
pluma1.html = {
  /* fonction : visible(element,etat)
	*
	*	@param String element 		: identifiant d'un élément
	*	@param boolean etat 		: true=visible ; false=not visible
	*/
  visible: function (idElement, etat) {
    //--- uniquement pour <tr> et <td> : visibility
    if (document.getElementById(idElement).tagName == 'TR' | document.getElementById(idElement).tagName == 'TD') {
      visibility = 'visible';
      if (etat == false) visibility = 'collapse';
      document.getElementById(idElement).style.visibility = visibility
      return;
    }    //--- autres élements 

    displayVal = 'inline';
    if (etat == false) {
      displayVal = 'none'
    };
    document.getElementById(idElement).style.display = displayVal;
  },
  /* fonction : clean(element)
	*  
	*	@param String element 		: identifiant d'un élément
	*/
  clean: function (element) {
    document.getElementById(element).innerHTML = '';
  },
  end: 'end'
};
/*
*  ----- form : Gestion interaction Form
* 
*	@rubrique String form		: id du formulaire ou indice dans forms[]. Si non défini on prends form[0]								si  
*
*/
pluma1.form = {
  iform: 0,
  /* fonction : submit(uri,keyCode)
	*
	*	@param String uri 		: url de action
	*	@param int keyCode 		: -1(forçage de submit) ou 13(CR)
    *
	*/
  submit: function (uri, keyCode) {
    if (keyCode != - 1 & keyCode != 13) return keyCode;
    if (pluma1.number.isNumber(this.iform)) {
      sform = document.forms[this.iform];
    } 
    else {
      sform = document.getElementById(this.iform);
    }
    sform.action = uri;
    sform.submit();
  },
  /* fonction : submitWithConfirm(uri,keyCode, messageConfirm)
	*
	*	@param String uri 				: url de action
	*	@param int keyCode 				: -1(forçage de submit) ou 13(CR)
	*   @param String messageConfirm	: message de confirmation
    *
	*/
  submitWithConfirm: function (uri, keyCode, messageConfirm) {
    if (keyCode != - 1 & keyCode != 13) return keyCode;
    var r = confirm(messageConfirm);
    if (r == false) {
      return false;
    }
    pluma1.form.submit(uri, keyCode);
  },
  /* fonction : alerte(message)
	*
	*   @param String message	: message, affichage si <>""
    *
	*/
  alerte: function (message) {
    if (message != '') alert(message);
  },
  /* fonction : focus(element)
	*
	*   @param String element	: id de l'élément, affichage si <>""
    *
	*/
  focus: function (element) {
    if (element != '') document.getElementById(element).focus();
  },
  info: function (message) {
    if (message == '') return;
    var element = 'plum_mvc_info';
    var s = document.getElementById(element);
    s.style.display = 'block';
    s.style.opacity = 1;
    s.innerHTML = message;
    setTimeout(pluma1.form.fade, 1000, element);
  },
  fade: function (element) {
    var s = document.getElementById(element).style;
    s.opacity -= 0.05;
    if (s.opacity < 0) return;
    setTimeout(pluma1.form.fade, 50, element);
  },
  redirect: function (uri) {
    if (uri != '') this.submit(uri, - 1);
  },
  end: 'end'
};
/*
*  ----- popup : Gestion popup
*  
*
*/
pluma1.popup = {
  /* --- wait : popup d'attente
*
*	@function show(message,pathImage)
*		@param message String message	 : message à afficher
*		@param pathImage String			 : URI/répertoire contenant les images
*
*	@function hide()
*
*/
  wait: {
    show: function (message, pathImage) {
      //alert("show:"+pathImage);
      //décrire la fenêtre masquante
      cache_position = 'absolute';
      cache_width = '100%';
      cache_height = '100%';
      cache_background_color = 'none';
      cache_text_align = 'center';
      cache_top = '0';
      cache_left = '0';
      //décrire la popup wait	
      wait_background_color = '#A9F5F2';
      wait_text = 'Veuillez patienter...';
      wait_width = '100px';
      wait_height = '100px';
      wait_opacity = '0.8';
      wait_margin_left = '600px'; //centrage top 
      wait_margin_top = '400px';
      wait_img = pathImage + 'ajaxloader2';
      //préparer le cache
      cache_style = ''
      + 'position:' + cache_position + ';'
      + 'width:' + cache_width + ';'
      + 'height:' + cache_height + ';'
      + 'background-color:' + cache_background_color + ';'
      + 'text-align:' + cache_text_align + ';'
      + 'top:' + cache_top + ';'
      + 'left:' + cache_left + ';'
      + '';
      div_cache = '<'
      + 'div id="wait_popup_cache" '
      + 'style="' + cache_style + '"'
      + '>';
      //préparer la popup wait
      wait_style = ''
      + 'background-color:' + wait_background_color + ';'
      + 'width:' + wait_width + ';'
      + 'height:' + wait_height + ';'
      + 'opacity:' + wait_opacity + ';'
      + 'margin-left:' + wait_margin_left + ';'
      + 'margin-top:' + wait_margin_top + ';'
      + '';
      div_wait = '<'
      + 'div id="wait_popup_wait" '
      + 'style="' + wait_style + '"'
      + '>'
      + '<div>' + message + '</div>'
      + '<div><img src="' + pathImage + 'ajaxloader2.gif" >';
      + '</div>';
      //affichage
      popup = '<div id="plum_template_wait_popup_on">' + div_cache + div_wait + '</div>' + '</div>';
      //alert("popup="+popup);
      document.body.innerHTML = document.body.innerHTML + popup;
    },
    hide: function () {
      //alert("hide");
      var element = document.getElementById('plum_template_wait_popup_on');
      element.parentNode.removeChild(element);
    }
  },
  end: 'end'
}/*
*  ----- number : librairie de manipulation des nombres
* 						si  
*
*/

pluma1.number = {
  isNumber: function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  end: 'end'
};
/*
* ------------------------------------------------------- LIBRAIRIE !!!!OBSOLETE!!! uniquement pour upgarde ------------------------------------------
*
*
*/
function form_submit(action, keyCode) {
  if (keyCode != - 1 & keyCode != 13) return keyCode;
  document.forms[0].action = action;
  document.forms[0].submit();
}
function form_confirm(action, keyCode, messageConfirm) {
  if (keyCode != - 1 & keyCode != 13) return keyCode;
  var r = confirm(messageConfirm);
  if (r == false) {
    return false;
  }
  pluma1.form.submit(action, keyCode);
}/*function on432UY(keyCode){	
			if (keyCode!='3errr4323E') return keyCode;
			document.forms[0].Hboot766T.value="GGHHBB(((--66"
			document.forms[0].submit();
}
*/

function form_wait_popup_off() {
  var element = document.getElementById('wait_popup_on');
  element.parentNode.removeChild(element);
  //document.getElementById('wait_popup_on').innerHTML="";
}
function form_wait_popup_on(message, pathImage) {
  //alert("wait");
  //décrire la fenêtre masquante
  cache_position = 'absolute';
  cache_width = '100%';
  cache_height = '100%';
  cache_background_color = 'none';
  cache_text_align = 'center';
  cache_top = '0';
  cache_left = '0';
  //décrire la popup wait	
  wait_background_color = '#A9F5F2';
  wait_text = 'Veuillez patienter...';
  wait_width = '100px';
  wait_height = '100px';
  wait_opacity = '0.8';
  wait_margin = '300px'; //centrage top et left
  //wait_img="template.plum/image/ajaxloader2.gif";
  wait_img = 'template.plum/image/ajaxloader2';
  //préparer le cache
  cache_style = ''
  + 'position:' + cache_position + ';'
  + 'width:' + cache_width + ';'
  + 'height:' + cache_height + ';'
  + 'background-color:' + cache_background_color + ';'
  + 'text-align:' + cache_text_align + ';'
  + 'top:' + cache_top + ';'
  + 'left:' + cache_left + ';'
  + '';
  div_cache = '<'
  + 'div id="wait_popup_cache" '
  + 'style="' + cache_style + '"'
  + '>';
  //préparer la popup wait
  wait_style = ''
  + 'background-color:' + wait_background_color + ';'
  + 'width:' + wait_width + ';'
  + 'height:' + wait_height + ';'
  + 'opacity:' + wait_opacity + ';'
  + 'margin-left:' + wait_margin + ';'
  + 'margin-top:' + wait_margin + ';'
  + '';
  div_wait = '<'
  + 'div id="wait_popup_wait" '
  + 'style="' + wait_style + '"'
  + '>'
  + '<div>' + message + '</div>'
  + '<div><img src="' + pathImage + 'ajaxloader2.gif" >';
  + '</div>';
  //affichage
  popup = '<div id="wait_popup_on">' + div_cache + div_wait + '</div>' + '</div>';
  //alert("popup="+popup);
  document.body.innerHTML = document.body.innerHTML + popup;
  //document.forms[0].submit();
}
function form_alert_focus(message, champFocus, redirect) {
  if (message != '') alert(message);
  if (champFocus != '') document.getElementById(champFocus).focus();
  if (typeof (redirect) == 'undefined') {
    return;
  }
  if (redirect == '') {
    return;
  }
  document.forms[0].action = redirect;
  document.forms[0].submit();
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}/*
[object Object]
*/
/*
[object Object]
*/
