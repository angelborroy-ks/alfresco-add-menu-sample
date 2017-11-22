# Alfresco: Cómo añadir un menú a la barra de herramientas de la Biblioteca de Documentos

*Este código es únicamente un tutorial, no tiene una finalidad práctica sino didáctica*.

Alfresco Share utiliza componentes **FTL** (FreeMarker) enriquecidos con **YUI** para la vista, **Spring Surf** para los controladores y la **API JavaScript Share** de servidor (Rhino) para la lógica.
 
En esta primera parte se describen componentes del proyecto de Share `add-menu-dl-share`.

El componente FTL al que vamos a añadir un botón se llama **documentlist-v2.get.html.ftl** y está ubicado en `org/alfresco/components/documentlibrary`.
 
## Extender el componente de Alfresco
 
Para extender este componente, se crea un archivo `add-menu.xml` como el siguiente en la carpeta `site-data/extensions` del proyecto Alfresco SDK de Share estándar:

```xml
<extension>
  <modules>
     <module>
       <id>Custom button</id>
       <customizations>
         <customization>
           <targetPackageRoot>org.alfresco.components.documentlibrary</targetPackageRoot>
           <sourcePackageRoot>es.keensoft.custom-button</sourcePackageRoot>
         </customization>
       </customizations>
       <auto-deploy>true</auto-deploy>
     </module>
   </modules>
</extension>
```

Una vez realizada esta declaración, se crean componentes con el mismo nombre que los originales de `org/alfresco/componentes/documentlibrary` en la carpeta `site-webscripts/es/keensoft/custom-button`. Estos componentes extenderán el comportamiento de los originales, por lo que se puede añadir el botóna los que ya aparecen en `documentlist-v2.get.html.ftl`
 
## Añadir el botón a la página FTL
 
Para añadir el botón a la página, se crea el fichero `site-webscripts/es/keensoft/custom-button/documentlist-v2.get.html.ftl` en el proyecto estándar Alfresco SDK con el siguiente contenido.

```xml
<@markup id="customToolbar-buttons" target="uploadButton" action="before">

  <#assign el = args.htmlid?html>
 
  <div id="${el}-createCustomButton-item" class="hideable toolbar-hidden DocListTree">
    <div class="create-content">
      <span id="${el}-createCustomButton-button" class="yui-button yui-push-button">
        <span class="first-child">
          <button name="createCustomButton">Botón</button>
        </span>
      </span>
    </div>
  </div>
 
</@markup>
```

Si se despliega el módulo en este estado en Alfresco Share, aparecerá un botón con la etiqueta **Botón** antes (`before`) del botón `uploadButton`. En el código anterior, esa es la posición que hemos definido en el bloque de `markup` anterior. 
 
## Definir el comportamiento del botón
 
En el paso anterior hemos colocado el botón en la página, a continuación escribiremos el código JavaScript de YUI (cliente!) necesario para definir el comportamiento del botón. Se añaden al comienzo del fichero FTL `site-webscripts/es/keensoft/custom-button/documentlist-v2.get.html.ftl` las líneas necesarias para que cargue nuestro código JavaScript.

```xml
<@markup id="customDocumentlist-js" target="js" action="after">
 <@script type="text/javascript" 
    src="${url.context}/res/sp/modules/custom-button.js" group="documentlibrary" />
</@>
```

Se crea el fichero `custom-button.js` en la carpeta `resources/META-INF/sp/modules` del proyecto Alfresco SDK con un contenido similar al siguiente.

```javascript 
var custom;

(function() {

 var Dom = YAHOO.util.Dom, Event = YAHOO.util.Event, Element = YAHOO.util.Element;
 var $html = Alfresco.util.encodeHTML, $siteURL = Alfresco.util.siteURL;

 // Ensure root object exists
 if (typeof custom == "undefined" || !custom)
 {
     custom = {};
 }
 custom.button = custom.button || {};
 
 // Declare custom toolbar
 custom.button.DocListToolbar = function CustomDocListToolbar_constructor(htmlId) {
   custom.button.DocListToolbar.superclass.constructor.call(this, htmlId);
   return this;
 };
 
 // Extend Alfresco DocListToolbar
 YAHOO.extend(custom.button.DocListToolbar, Alfresco.DocListToolbar);
 YAHOO.lang.augmentProto(custom.button.DocListToolbar, Alfresco.doclib.Actions);
 
 // Extend default DocListToolbar...
 YAHOO.extend(custom.button.DocListToolbar, Alfresco.DocListToolbar,
 {
 
   onReady: function DLTB_onReady()
   {
     custom.button.DocListToolbar.superclass.onReady.call(this); 
     // Link button to YUI and attach function "onClick"
     this.widgets.customButton = Alfresco.util.createYUIButton(this, "createCustomButton-button", this.onClickCustomButton,
     {
       disabled: false,
       value: "CreateChildren"
     });
     this.dynamicControls.push(this.widgets.customButton);
   },
 
   onClickCustomButton: function DLTB_onClickCustomButton(e, p_obj)
   {
     var destination = this.doclistMetadata.parent.nodeRef;
     
     // Write your own code
     alert(destination);
   }
 
 });
 
})();
```

El código anterior extiende el componente YUI **Alfresco.DocListToolbar** para añadir el control para el botón `createCustomButton` inyectado en el FTL anterior. En este ejemplo únicamente mostrará un alert JavaScript con el *NodeRef* de la carpeta en la que se encuentra el usuario. No obstante, pueden añadirse las operaciones necesarias con el repositorio mediante la API **Alfresco.util.Ajax** o cualquier otro tipo de lógica requerida en JavaScript cliente.
 
## Cargar el control YUI personalizado
 
Como último paso, es necesario declarar el nuevo componente en la capa de modelo de JavaScript servidor. Para ello, creamos el fichero `site-webscripts/es/keensoft/custom-button/documentlist-v2.get.js` en nuestro proyecto Alfresco SDK estándar, que extenderá el comportamiento por defecto.

```javascript 
// Register new doclist toolbar
for (var i=0; i<model.widgets.length; i++)
{
 if (model.widgets[i].id == "DocListToolbar")
 {
   model.widgets[i].name = "custom.button.DocListToolbar";
 }
}
```

Una vez realizados estos pasos, el botón "Botón" aparecerá en la barra de la lista de documentos y obtendrá un *alert* con un *NodeRef* cuando se pulse. 
 

## Otras barras de tareas

Existen componentes específicos de barra de tareas para otras páginas de Alfresco. En el proyecto se han creado también las extensiones para cada uno de ellos a modo de ejemplo:

* Mis Ficheros: myfiles.get.html.ftl, myfiles.get.js, custom-button-myfiles.js

* Ficheros compartidos: sharedfiles.get.html.ftl, sharedfiles.get.js, custom-button-sharedfiles.js

* Repositorio: repo.get.html.ftl, repo.get.js, custom-button-repo.js

## Disclaimer

Existen otras maneras maneras de realizar esta extensión (como https://github.com/keensoft/alfresco-site-node-templates/blob/master/site-node-template-share/src/main/resources/META-INF/resources/site-node-template-share/js/site-node-template-share.js), pero el ejemplo anterior ilustra el comportamiento de cada uno de los elementos que construyen las páginas en Share. 
 

# Alfresco: Cómo desarrollar la lógica de repositorio asociada al botón

*Share* es una aplicación web de cliente que no contiene lógica de negocio. Por tanto, si el botón necesita realizar operaciones en el repositorio de Alfresco será necesario desarrollar esa lógica en un proyecto de Repo que sea invocado desde *Share* a través de una invocación REST.

En esta segunda parte se describen componentes del proyecto de Repo `add-menu-dl-repo` y una modificación en el proyecto `add-menu-dl-share` para invocar a la lógica de repositorio.


## Desarrollar un Web Script de repositorio

Alfresco dispone de una API de desarrollo de servicios REST denominada **Web Script**. En este caso vamos a desarrollar un servicio REST que crea un fichero en la carpeta indicada. Por convención, las operaciones de creación en las APIs REST se realizan mediante HTTP POST y por comodidad vamos a realizar el intercambio de información en formato JSON. 

> Pueden desarrollarse otro tipo de Web Scripts mediante HTTP GET, PUT o DELETE o enviar los parámetros de la URL. 

La lógica del Web Script será desarrollada utilizando la **API JavaScript** de servidor de Alfresco basada en Rhino, aunque podría desarrollarse de manera equivalente utilizando la **API Java**.

Los Web Scripts suelen constar de:

* Un XML de descripción y declaración del servicio
* Un JavaScript o una clase Java de controlador para realizar las operaciones de repositorio requeridas
* Un FTL de vista para representar el resultado en HTML o JSON

### Descripción del Web Script

Creamos el fichero `webscripts/keensoft/files/createfile.post.desc.xml` en nuestro proyecto de repositorio Alfresco SDK estándar. Es importante que el fichero esté bajo el directorio `webscripts` y que incluya como extensión el verbo del HTTP (`post` en este caso) seguido de `desc.xml`. Las carpetas intermedias `keensoft\files` son arbitrarias, pueden crearse cualquier otras.

Este fichero define:

* La URL en la que estará disponible el servicio, que será precedida por [http://localhost:8080/alfresco/s/](http://localhost:8080/alfresco/s/) para invocarlo
  * En este caso [http://localhost:8080/alfresco/s/files/create](http://localhost:8080/alfresco/s/files/create)
* El tipo de autenticación requerida (usuario)
* El formato de la respuesta (JSON)

```xml
<webscript>
  <shortname>Create file Sample Web Script</shortname>
  <description>Create sample file at destination</description>
  <url>/files/create</url>
  <authentication>user</authentication>
  <format default="json"></format>
</webscript>
```

### Controlador del Web Script

A continuación definimos la lógica del servicio mediante la API JavaScript de repositorio de Alfresco. Es importante notar que este JavaScript es de servidor y que es por tanto equivalente a la API Java del producto.

Para ello creamos el fichero `webscripts/keensoft/files/createfile.post.json.js`. Requiere ser creado en la misma carpeta que el descriptor y que la extensión sea el verbo del HTTP (`post` en este caso) y el formato de los datos en la petición (`json` en este caso).

La implementación realizada extrae la información del objeto JSON `destination` que es enviado en la petición (es el *NodeRef* de una carpeta) y crea un fichero `newFile.txt` con el contenido `original text` en esa carpeta. Por último pone la información del fichero creado en el objeto `model` para que pueda ser utilizada en la vista FTL.

```javascript
// extract arguments from JSON
var destination = json.get("destination");

// search for folder
var folder = search.findNode(destination);

// validate that folder has been found
if (folder == undefined || !folder.isContainer) {
   status.code = 404;
   status.message = "Folder " + destination + " not found.";
   status.redirect = true;
}

// create sample file
var doc = folder.createFile("newFile.txt");
doc.content = "original text";

// put information for FTL view
model.doc = doc;
```


### Vista del Web Script

Construimos la respuesta JSON en el fichero `webscripts/keensoft/files/createfile.post.json.ftl`, que incluye como extensión el verbo HTTP (`post` en este caso), el formato de la respuesta (`json`) y el tipo de archivo (`ftl`).

En esta plantilla FTL (FreeMarker) disponemos de todos los datos que hayamos incluido en el objeto `model` en el controlador (`doc` en nuestro caso). A continuación formamos el JSON incluyendo algunos valores del objeto `doc`.

```json
{
    "doc": {
        "nodeRef" : "${doc.nodeRef}",
        "name" : "${doc.name}"
    }
}
```


Una vez realizados estos pasos, deberíamos ser capaces de crear un fichero `newFile.txt` en la carpeta con *NodeRef* `workspace://SpacesStore/5418807b-cf50-4f74-85a2-f72bd3daa383` realizando la siguiente petición:

```bash
curl -X POST \
  http://localhost:8080/alfresco/s/files/create \
  -H 'authorization: Basic YWRtaW46YWRtaW4=' \
  -H 'content-type: application/json' \
  -d '{ "destination" : "workspace://SpacesStore/5418807b-cf50-4f74-85a2-f72bd3daa383" }'
```

El bloque autorización en este ejemplo incluye `admin:admin` pero es posible que deba ser cambiado en caso de que las credenciales de acceso a Alfresco sean diferentes.


## Invocando el Web Script desde Share

Una vez que hemos construido el Web Script y está disponible, podemos realizar la invocación a la API REST desde nuestros componentes YUI de Share utilizando la clase de ayuda `Alfresco.util.Ajax.request`. En el ejemplo vamos a modificar el fichero `custom-button-sharedfiles.js` de la carpeta `resources/META-INF/sp/modules` del proyecto Alfresco Share SDK `add-menu-dl-share`.

Debajo del `alert` existente realizamos las siguientes operaciones:

* Invocación asíncrona con *callback* de éxito (`successCallback`) y *callback* de error (`failureCallback`)
* Construcción del JSON de envío en el atributo `dataObj`
* Decodificación del JSON de respuesta en la función `onRequestSucess`
* Mensajes de información para el usuario mediante la utilidad `Alfresco.util.PopupManager.displayMessage`

```javascript

...

// Write your own code
alert("Shared files: " + destination);
 
 // Invoke async repo Web Script by using HTTP POST and JSON
Alfresco.util.Ajax.request(
 {
    method: Alfresco.util.Ajax.POST,
    url:  Alfresco.constants.PROXY_URI + "/files/create",
    dataObj:
    {
       destination: destination
    },
    requestContentType: Alfresco.util.Ajax.JSON,
    successCallback:
    {
         fn: function onRequestSuccess(response)
         {
             var json = Alfresco.util.parseJSON(response.serverResponse.responseText);
             Alfresco.util.PopupManager.displayMessage(
             {
                 text: "File created: " + json.doc.name + " (" + json.doc.nodeRef + ")"
             })
         },
         scope: this                
      },
    failureCallback:
    {
       fn: function onRequestFailure()
         {
             Alfresco.util.PopupManager.displayMessage(
             {
                 text: "File has not been created!"
             })
          },
          scope: this               
    }
 });
```

> Una vez realizado este cambio, cuando el botón "Botón" de la barra de herramientas de la Biblioteca de Documentos sea pulsado en la página "Ficheros compartidos", se creará un fichero "newFile.txt" en esa carpeta.