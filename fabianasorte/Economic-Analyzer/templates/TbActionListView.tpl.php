<?php
	$this->assign('title','economic-analyzer | TbActions');
	$this->assign('nav','tbactions');

	$this->display('_Header.tpl.php');
?>

<script type="text/javascript">
	$LAB.script("scripts/app/tbactions.js").wait(function(){
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
	<i class="icon-th-list"></i> TbActions
	<span id=loader class="loader progress progress-striped active"><span class="bar"></span></span>
	<span class='input-append pull-right searchContainer'>
		<input id='filter' type="text" placeholder="Search..." />
		<button class='btn add-on'><i class="icon-search"></i></button>
	</span>
</h1>

	<!-- underscore template for the collection -->
	<script type="text/template" id="tbActionCollectionTemplate">
		<table class="collection table table-bordered table-hover">
		<thead>
			<tr>
				<th id="header_IdAction">Id Action<% if (page.orderBy == 'IdAction') { %> <i class='icon-arrow-<%= page.orderDesc ? 'up' : 'down' %>' /><% } %></th>
				<th id="header_StrCodAction">Str Cod Action<% if (page.orderBy == 'StrCodAction') { %> <i class='icon-arrow-<%= page.orderDesc ? 'up' : 'down' %>' /><% } %></th>
				<th id="header_StrNameAction">Str Name Action<% if (page.orderBy == 'StrNameAction') { %> <i class='icon-arrow-<%= page.orderDesc ? 'up' : 'down' %>' /><% } %></th>
			</tr>
		</thead>
		<tbody>
		<% items.each(function(item) { %>
			<tr id="<%= _.escape(item.get('idAction')) %>">
				<td><%= _.escape(item.get('idAction') || '') %></td>
				<td><%= _.escape(item.get('strCodAction') || '') %></td>
				<td><%= _.escape(item.get('strNameAction') || '') %></td>
			</tr>
		<% }); %>
		</tbody>
		</table>

		<%=  view.getPaginationHtml(page) %>
	</script>

	<!-- underscore template for the model -->
	<script type="text/template" id="tbActionModelTemplate">
		<form class="form-horizontal" onsubmit="return false;">
			<fieldset>
				<div id="idActionInputContainer" class="control-group">
					<label class="control-label" for="idAction">Id Action</label>
					<div class="controls inline-inputs">
						<span class="input-xlarge uneditable-input" id="idAction"><%= _.escape(item.get('idAction') || '') %></span>
						<span class="help-inline"></span>
					</div>
				</div>
				<div id="strCodActionInputContainer" class="control-group">
					<label class="control-label" for="strCodAction">Str Cod Action</label>
					<div class="controls inline-inputs">
						<input type="text" class="input-xlarge" id="strCodAction" placeholder="Str Cod Action" value="<%= _.escape(item.get('strCodAction') || '') %>">
						<span class="help-inline"></span>
					</div>
				</div>
				<div id="strNameActionInputContainer" class="control-group">
					<label class="control-label" for="strNameAction">Str Name Action</label>
					<div class="controls inline-inputs">
						<input type="text" class="input-xlarge" id="strNameAction" placeholder="Str Name Action" value="<%= _.escape(item.get('strNameAction') || '') %>">
						<span class="help-inline"></span>
					</div>
				</div>
			</fieldset>
		</form>

		<!-- delete button is is a separate form to prevent enter key from triggering a delete -->
		<form id="deleteTbActionButtonContainer" class="form-horizontal" onsubmit="return false;">
			<fieldset>
				<div class="control-group">
					<label class="control-label"></label>
					<div class="controls">
						<button id="deleteTbActionButton" class="btn btn-mini btn-danger"><i class="icon-trash icon-white"></i> Delete TbAction</button>
						<span id="confirmDeleteTbActionContainer" class="hide">
							<button id="cancelDeleteTbActionButton" class="btn btn-mini">Cancel</button>
							<button id="confirmDeleteTbActionButton" class="btn btn-mini btn-danger">Confirm</button>
						</span>
					</div>
				</div>
			</fieldset>
		</form>
	</script>

	<!-- modal edit dialog -->
	<div class="modal hide fade" id="tbActionDetailDialog">
		<div class="modal-header">
			<a class="close" data-dismiss="modal">&times;</a>
			<h3>
				<i class="icon-edit"></i> Edit TbAction
				<span id="modelLoader" class="loader progress progress-striped active"><span class="bar"></span></span>
			</h3>
		</div>
		<div class="modal-body">
			<div id="modelAlert"></div>
			<div id="tbActionModelContainer"></div>
		</div>
		<div class="modal-footer">
			<button class="btn" data-dismiss="modal" >Cancel</button>
			<button id="saveTbActionButton" class="btn btn-primary">Save Changes</button>
		</div>
	</div>

	<div id="collectionAlert"></div>
	
	<div id="tbActionCollectionContainer" class="collectionContainer">
	</div>

	<p id="newButtonContainer" class="buttonContainer">
		<button id="newTbActionButton" class="btn btn-primary">Add TbAction</button>
	</p>

</div> <!-- /container -->

<?php
	$this->display('_Footer.tpl.php');
?>
