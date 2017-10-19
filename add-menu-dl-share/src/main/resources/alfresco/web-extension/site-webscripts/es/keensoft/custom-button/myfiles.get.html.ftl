<@markup id="customDocumentlist-js" target="js" action="after">
 <@script type="text/javascript" 
    src="${url.context}/res/sp/modules/custom-button-myfiles.js" group="documentlibrary" />
</@>

<@markup id="customToolbar-myfiles-buttons" target="uploadButton" action="before">

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