<?php
	$this->assign('title','economic-analyzer | TbFunctionses');
	$this->assign('nav','tbfunctionses');

	$this->display('_Header.tpl.php');
?>

<script type="text/javascript">
	$LAB.script("scripts/app/tbfunctionses.js").wait(function(){
		$(document).ready(function(){
			page.init();
		});
		
		// hack for IE9 which may respond inconsistently with document.ready
		setTimeout(function(){
			if (!page.isInitialized) page.init();
		},1000);
	});
</script>

<div class="container">

<h1>
	<i class="icon-th-list"></i> TbFunctionses
	<span id=loader class="loader progress progress-striped active"><span class="bar"></span></span>
	<span class='input-append pull-right searchContainer'>
		<input id='filter' type="text" placeholder="Search..." />
		<button class='btn add-on'><i class="icon-search"></i></button>
	</span>
</h1>

	<!-- underscore template for the collection -->
	<script type="text/template" id="tbFunctionsCollectionTemplate">
		<table class="collection table table-bordered table-hover">
		<thead>
			<tr>
				<th id="header_IdFunction">Id Function<% if (page.orderBy == 'IdFunction') { %> <i class='icon-arrow-<%= page.orderDesc ? 'up' : 'down' %>' /><% } %></th>
				<th id="header_StrCodFunction">Str Cod Function<% if (page.orderBy == 'StrCodFunction') { %> <i class='icon-arrow-<%= page.orderDesc ? 'up' : 'down' %>' /><% } %></th>
				<th id="header_StrNameFunction">Str Name Function<% if (page.orderBy == 'StrNameFunction') { %> <i class='icon-arrow-<%= page.orderDesc ? 'up' : 'down' %>' /><% } %></th>
			</tr>
		</thead>
		<tbody>
		<% items.each(function(item) { %>
			<tr id="<%= _.escape(item.get('idFunction')) %>">
				<td><%= _.escape(item.get('idFunction') || '') %></td>
				<td><%= _.escape(item.get('strCodFunction') || '') %></td>
				<td><%= _.escape(item.get('strNameFunction') || '') %></td>
			</tr>
		<% }); %>
		</tbody>
		</table>

		<%=  view.getPaginationHtml(page) %>
	</script>

	<!-- underscore template for the model -->
	<script type="text/template" id="tbFunctionsModelTemplate">
		<form class="form-horizontal" onsubmit="return false;">
			<fieldset>
				<div id="idFunctionInputContainer" class="control-group">
					<label class="control-label" for="idFunction">Id Function</label>
					<div class="controls inline-inputs">
						<span class="input-xlarge uneditable-input" id="idFunction"><%= _.escape(item.get('idFunction') || '') %></span>
						<span class="help-inline"></span>
					</div>
				</div>
				<div id="strCodFunctionInputContainer" class="control-group">
					<label class="control-label" for="strCodFunction">Str Cod Function</label>
					<div class="controls inline-inputs">
						<input type="text" class="input-xlarge" id="strCodFunction" placeholder="Str Cod Function" value="<%= _.escape(item.get('strCodFunction') || '') %>">
						<span class="help-inline"></span>
					</div>
				</div>
				<div id="strNameFunctionInputContainer" class="control-group">
					<label class="control-label" for="strNameFunction">Str Name Function</label>
					<div class="controls inline-inputs">
						<input type="text" class="input-xlarge" id="strNameFunction" placeholder="Str Name Function" value="<%= _.escape(item.get('strNameFunction') || '') %>">
						<span class="help-inline"></span>
					</div>
				</div>
			</fieldset>
		</form>

		<!-- delete button is is a separate form to prevent enter key from triggering a delete -->
		<form id="deleteTbFunctionsButtonContainer" class="form-horizontal" onsubmit="return false;">
			<fieldset>
				<div class="control-group">
					<label class="control-label"></label>
					<div class="controls">
						<button id="deleteTbFunctionsButton" class="btn btn-mini btn-danger"><i class="icon-trash icon-white"></i> Delete TbFunctions</button>
						<span id="confirmDeleteTbFunctionsContainer" class="hide">
							<button id="cancelDeleteTbFunctionsButton" class="btn btn-mini">Cancel</button>
							<button id="confirmDeleteTbFunctionsButton" class="btn btn-mini btn-danger">Confirm</button>
						</span>
					</div>
				</div>
			</fieldset>
		</form>
	</script>

	<!-- modal edit dialog -->
	<div class="modal hide fade" id="tbFunctionsDetailDialog">
		<div class="modal-header">
			<a class="close" data-dismiss="modal">&times;</a>
			<h3>
				<i class="icon-edit"></i> Edit TbFunctions
				<span id="modelLoader" class="loader progress progress-striped active"><span class="bar"></span></span>
			</h3>
		</div>
		<div class="modal-body">
			<div id="modelAlert"></div>
			<div id="tbFunctionsModelContainer"></div>
		</div>
		<div class="modal-footer">
			<button class="btn" data-dismiss="modal" >Cancel</button>
			<button id="saveTbFunctionsButton" class="btn btn-primary">Save Changes</button>
		</div>
	</div>

	<div id="collectionAlert"></div>
	
	<div id="tbFunctionsCollectionContainer" class="collectionContainer">
	</div>

	<p id="newButtonContainer" class="buttonContainer">
		<button id="newTbFunctionsButton" class="btn btn-primary">Add TbFunctions</button>
	</p>

</div> <!-- /container -->

<?php
	$this->display('_Footer.tpl.php');
?>
