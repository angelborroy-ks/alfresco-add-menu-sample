# Alfresco: Cómo añadir un menú a la barra de herramientas de la Biblioteca de Documentos

*Este código es únicamente un tutorial, no tiene una finalidad práctica sino didáctica*.

Alfresco Share utiliza componentes **FTL** (FreeMarker) enriquecidos con **YUI** para la vista, **Spring Surf** para los controladores y la **API JavaScript Share** de servidor (Rhino) para la lógica.
 
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
 
## Disclaimer

Existen otras maneras maneras de realizar esta extensión (como https://github.com/keensoft/alfresco-site-node-templates/blob/master/site-node-template-share/src/main/resources/META-INF/resources/site-node-template-share/js/site-node-template-share.js), pero el ejemplo anterior ilustra el comportamiento de cada uno de los elementos que construyen las páginas en Share. 
 
Para desarrollar la lógica contra el repositorio, se utiliza código JavaScript de cliente en la capa YUI (`Alfresco.util.Ajax`) y JavaScript de servidor en la capa JS (`remote.connect`). En cualquier caso, es necesario entender que Share no tiene acceso a la API nativa del repositorio de Alfresco. Desde Share únicamente puede utilizarse el API REST.