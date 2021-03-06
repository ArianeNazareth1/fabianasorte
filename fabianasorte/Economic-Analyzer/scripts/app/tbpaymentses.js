/**
 * View logic for TbPaymentses
 */

/**
 * application logic specific to the TbPayments listing page
 */
var page = {

	tbPaymentses: new model.TbPaymentsCollection(),
	collectionView: null,
	tbPayments: null,
	modelView: null,
	isInitialized: false,
	isInitializing: false,

	fetchParams: { filter: '', orderBy: '', orderDesc: '', page: 1 },
	fetchInProgress: false,
	dialogIsOpen: false,

	/**
	 *
	 */
	init: function() {
		// ensure initialization only occurs once
		if (page.isInitialized || page.isInitializing) return;
		page.isInitializing = true;

		if (!$.isReady && console) console.warn('page was initialized before dom is ready.  views may not render properly.');

		// make the new button clickable
		$("#newTbPaymentsButton").click(function(e) {
			e.preventDefault();
			page.showDetailDialog();
		});

		// let the page know when the dialog is open
		$('#tbPaymentsDetailDialog').on('show',function() {
			page.dialogIsOpen = true;
		});

		// when the model dialog is closed, let page know and reset the model view
		$('#tbPaymentsDetailDialog').on('hidden',function() {
			$('#modelAlert').html('');
			page.dialogIsOpen = false;
		});

		// save the model when the save button is clicked
		$("#saveTbPaymentsButton").click(function(e) {
			e.preventDefault();
			page.updateModel();
		});

		// initialize the collection view
		this.collectionView = new view.CollectionView({
			el: $("#tbPaymentsCollectionContainer"),
			templateEl: $("#tbPaymentsCollectionTemplate"),
			collection: page.tbPaymentses
		});

		// initialize the search filter
		$('#filter').change(function(obj) {
			page.fetchParams.filter = $('#filter').val();
			page.fetchParams.page = 1;
			page.fetchTbPaymentses(page.fetchParams);
		});
		
		// make the rows clickable ('rendered' is a custom event, not a standard backbone event)
		this.collectionView.on('rendered',function(){

			// attach click handler to the table rows for editing
			$('table.collection tbody tr').click(function(e) {
				e.preventDefault();
				var m = page.tbPaymentses.get(this.id);
				page.showDetailDialog(m);
			});

			// make the headers clickable for sorting
 			$('table.collection thead tr th').click(function(e) {
 				e.preventDefault();
				var prop = this.id.replace('header_','');

				// toggle the ascending/descending before we change the sort prop
				page.fetchParams.orderDesc = (prop == page.fetchParams.orderBy && !page.fetchParams.orderDesc) ? '1' : '';
				page.fetchParams.orderBy = prop;
				page.fetchParams.page = 1;
 				page.fetchTbPaymentses(page.fetchParams);
 			});

			// attach click handlers to the pagination controls
			$('.pageButton').click(function(e) {
				e.preventDefault();
				page.fetchParams.page = this.id.substr(5);
				page.fetchTbPaymentses(page.fetchParams);
			});
			
			page.isInitialized = true;
			page.isInitializing = false;
		});

		// backbone docs recommend bootstrapping data on initial page load, but we live by our own rules!
		this.fetchTbPaymentses({ page: 1 });

		// initialize the model view
		this.modelView = new view.ModelView({
			el: $("#tbPaymentsModelContainer")
		});

		// tell the model view where it's template is located
		this.modelView.templateEl = $("#tbPaymentsModelTemplate");

		if (model.longPollDuration > 0)	{
			setInterval(function () {

				if (!page.dialogIsOpen)	{
					page.fetchTbPaymentses(page.fetchParams,true);
				}

			}, model.longPollDuration);
		}
	},

	/**
	 * Fetch the collection data from the server
	 * @param object params passed through to collection.fetch
	 * @param bool true to hide the loading animation
	 */
	fetchTbPaymentses: function(params, hideLoader) {
		// persist the params so that paging/sorting/filtering will play together nicely
		page.fetchParams = params;

		if (page.fetchInProgress) {
			if (console) console.log('supressing fetch because it is already in progress');
		}

		page.fetchInProgress = true;

		if (!hideLoader) app.showProgress('loader');

		page.tbPaymentses.fetch({

			data: params,

			success: function() {

				if (page.tbPaymentses.collectionHasChanged) {
					// TODO: add any logic necessary if the collection has changed
					// the sync event will trigger the view to re-render
				}

				app.hideProgress('loader');
				page.fetchInProgress = false;
			},

			error: function(m, r) {
				app.appendAlert(app.getErrorMessage(r), 'alert-error',0,'collectionAlert');
				app.hideProgress('loader');
				page.fetchInProgress = false;
			}

		});
	},

	/**
	 * show the dialog for editing a model
	 * @param model
	 */
	showDetailDialog: function(m) {

		// show the modal dialog
		$('#tbPaymentsDetailDialog').modal({ show: true });

		// if a model was specified then that means a user is editing an existing record
		// if not, then the user is creating a new record
		page.tbPayments = m ? m : new model.TbPaymentsModel();

		page.modelView.model = page.tbPayments;

		if (page.tbPayments.id == null || page.tbPayments.id == '') {
			// this is a new record, there is no need to contact the server
			page.renderModelView(false);
		} else {
			app.showProgress('modelLoader');

			// fetch the model from the server so we are not updating stale data
			page.tbPayments.fetch({

				success: function() {
					// data returned from the server.  render the model view
					page.renderModelView(true);
				},

				error: function(m, r) {
					app.appendAlert(app.getErrorMessage(r), 'alert-error',0,'modelAlert');
					app.hideProgress('modelLoader');
				}

			});
		}

	},

	/**
	 * Render the model template in the popup
	 * @param bool show the delete button
	 */
	renderModelView: function(showDeleteButton)	{
		page.modelView.render();

		app.hideProgress('modelLoader');

		// initialize any special controls
		try {
			$('.date-picker')
				.datepicker()
				.on('changeDate', function(ev){
					$('.date-picker').datepicker('hide');
				});
		} catch (error) {
			// this happens if the datepicker input.value isn't a valid date
			if (console) console.log('datepicker error: '+error.message);
		}
		
		$('.timepicker-default').timepicker({ defaultTime: 'value' });

		// populate the dropdown options for tbCityIdCity
		// TODO: load only the selected value, then fetch all options when the drop-down is clicked
		var tbCityIdCityValues = new model.TbCityCollection();
		tbCityIdCityValues.fetch({
			success: function(c){
				var dd = $('#tbCityIdCity');
				dd.append('<option value=""></option>');
				c.forEach(function(item,index) {
					dd.append(app.getOptionHtml(
						item.get('idCity'),
						item.get('strNameCity'), // TODO: change fieldname if the dropdown doesn't show the desired column
						page.tbPayments.get('tbCityIdCity') == item.get('idCity')
					));
				});
				
				if (!app.browserSucks()) {
					dd.combobox();
					$('div.combobox-container + span.help-inline').hide(); // TODO: hack because combobox is making the inline help div have a height
				}

			},
			error: function(collection,response,scope) {
				app.appendAlert(app.getErrorMessage(response), 'alert-error',0,'modelAlert');
			}
		});

		// populate the dropdown options for tbFunctionsIdFunction
		// TODO: load only the selected value, then fetch all options when the drop-down is clicked
		var tbFunctionsIdFunctionValues = new model.TbFunctionsCollection();
		tbFunctionsIdFunctionValues.fetch({
			success: function(c){
				var dd = $('#tbFunctionsIdFunction');
				dd.append('<option value=""></option>');
				c.forEach(function(item,index) {
					dd.append(app.getOptionHtml(
						item.get('idFunction'),
						item.get('strCodFunction'), // TODO: change fieldname if the dropdown doesn't show the desired column
						page.tbPayments.get('tbFunctionsIdFunction') == item.get('idFunction')
					));
				});
				
				if (!app.browserSucks()) {
					dd.combobox();
					$('div.combobox-container + span.help-inline').hide(); // TODO: hack because combobox is making the inline help div have a height
				}

			},
			error: function(collection,response,scope) {
				app.appendAlert(app.getErrorMessage(response), 'alert-error',0,'modelAlert');
			}
		});

		// populate the dropdown options for tbSubfunctionsIdSubfunction
		// TODO: load only the selected value, then fetch all options when the drop-down is clicked
		var tbSubfunctionsIdSubfunctionValues = new model.TbSubfunctionsCollection();
		tbSubfunctionsIdSubfunctionValues.fetch({
			success: function(c){
				var dd = $('#tbSubfunctionsIdSubfunction');
				dd.append('<option value=""></option>');
				c.forEach(function(item,index) {
					dd.append(app.getOptionHtml(
						item.get('idSubfunction'),
						item.get('strCodSubfunction'), // TODO: change fieldname if the dropdown doesn't show the desired column
						page.tbPayments.get('tbSubfunctionsIdSubfunction') == item.get('idSubfunction')
					));
				});
				
				if (!app.browserSucks()) {
					dd.combobox();
					$('div.combobox-container + span.help-inline').hide(); // TODO: hack because combobox is making the inline help div have a height
				}

			},
			error: function(collection,response,scope) {
				app.appendAlert(app.getErrorMessage(response), 'alert-error',0,'modelAlert');
			}
		});

		// populate the dropdown options for tbProgramIdProgram
		// TODO: load only the selected value, then fetch all options when the drop-down is clicked
		var tbProgramIdProgramValues = new model.TbProgramCollection();
		tbProgramIdProgramValues.fetch({
			success: function(c){
				var dd = $('#tbProgramIdProgram');
				dd.append('<option value=""></option>');
				c.forEach(function(item,index) {
					dd.append(app.getOptionHtml(
						item.get('idProgram'),
						item.get('strCodProgram'), // TODO: change fieldname if the dropdown doesn't show the desired column
						page.tbPayments.get('tbProgramIdProgram') == item.get('idProgram')
					));
				});
				
				if (!app.browserSucks()) {
					dd.combobox();
					$('div.combobox-container + span.help-inline').hide(); // TODO: hack because combobox is making the inline help div have a height
				}

			},
			error: function(collection,response,scope) {
				app.appendAlert(app.getErrorMessage(response), 'alert-error',0,'modelAlert');
			}
		});

		// populate the dropdown options for tbActionIdAction
		// TODO: load only the selected value, then fetch all options when the drop-down is clicked
		var tbActionIdActionValues = new model.TbActionCollection();
		tbActionIdActionValues.fetch({
			success: function(c){
				var dd = $('#tbActionIdAction');
				dd.append('<option value=""></option>');
				c.forEach(function(item,index) {
					dd.append(app.getOptionHtml(
						item.get('idAction'),
						item.get('strCodAction'), // TODO: change fieldname if the dropdown doesn't show the desired column
						page.tbPayments.get('tbActionIdAction') == item.get('idAction')
					));
				});
				
				if (!app.browserSucks()) {
					dd.combobox();
					$('div.combobox-container + span.help-inline').hide(); // TODO: hack because combobox is making the inline help div have a height
				}

			},
			error: function(collection,response,scope) {
				app.appendAlert(app.getErrorMessage(response), 'alert-error',0,'modelAlert');
			}
		});

		// populate the dropdown options for tbBeneficiariesIdBeneficiaries
		// TODO: load only the selected value, then fetch all options when the drop-down is clicked
		var tbBeneficiariesIdBeneficiariesValues = new model.TbBeneficiariesCollection();
		tbBeneficiariesIdBeneficiariesValues.fetch({
			success: function(c){
				var dd = $('#tbBeneficiariesIdBeneficiaries');
				dd.append('<option value=""></option>');
				c.forEach(function(item,index) {
					dd.append(app.getOptionHtml(
						item.get('idBeneficiaries'),
						item.get('strNis'), // TODO: change fieldname if the dropdown doesn't show the desired column
						page.tbPayments.get('tbBeneficiariesIdBeneficiaries') == item.get('idBeneficiaries')
					));
				});
				
				if (!app.browserSucks()) {
					dd.combobox();
					$('div.combobox-container + span.help-inline').hide(); // TODO: hack because combobox is making the inline help div have a height
				}

			},
			error: function(collection,response,scope) {
				app.appendAlert(app.getErrorMessage(response), 'alert-error',0,'modelAlert');
			}
		});

		// populate the dropdown options for tbSourceIdSource
		// TODO: load only the selected value, then fetch all options when the drop-down is clicked
		var tbSourceIdSourceValues = new model.TbSourceCollection();
		tbSourceIdSourceValues.fetch({
			success: function(c){
				var dd = $('#tbSourceIdSource');
				dd.append('<option value=""></option>');
				c.forEach(function(item,index) {
					dd.append(app.getOptionHtml(
						item.get('idSource'),
						item.get('strGoal'), // TODO: change fieldname if the dropdown doesn't show the desired column
						page.tbPayments.get('tbSourceIdSource') == item.get('idSource')
					));
				});
				
				if (!app.browserSucks()) {
					dd.combobox();
					$('div.combobox-container + span.help-inline').hide(); // TODO: hack because combobox is making the inline help div have a height
				}

			},
			error: function(collection,response,scope) {
				app.appendAlert(app.getErrorMessage(response), 'alert-error',0,'modelAlert');
			}
		});

		// populate the dropdown options for tbFilesIdFile
		// TODO: load only the selected value, then fetch all options when the drop-down is clicked
		var tbFilesIdFileValues = new model.TbFilesCollection();
		tbFilesIdFileValues.fetch({
			success: function(c){
				var dd = $('#tbFilesIdFile');
				dd.append('<option value=""></option>');
				c.forEach(function(item,index) {
					dd.append(app.getOptionHtml(
						item.get('idFile'),
						item.get('strNameFile'), // TODO: change fieldname if the dropdown doesn't show the desired column
						page.tbPayments.get('tbFilesIdFile') == item.get('idFile')
					));
				});
				
				if (!app.browserSucks()) {
					dd.combobox();
					$('div.combobox-container + span.help-inline').hide(); // TODO: hack because combobox is making the inline help div have a height
				}

			},
			error: function(collection,response,scope) {
				app.appendAlert(app.getErrorMessage(response), 'alert-error',0,'modelAlert');
			}
		});


		if (showDeleteButton) {
			// attach click handlers to the delete buttons

			$('#deleteTbPaymentsButton').click(function(e) {
				e.preventDefault();
				$('#confirmDeleteTbPaymentsContainer').show('fast');
			});

			$('#cancelDeleteTbPaymentsButton').click(function(e) {
				e.preventDefault();
				$('#confirmDeleteTbPaymentsContainer').hide('fast');
			});

			$('#confirmDeleteTbPaymentsButton').click(function(e) {
				e.preventDefault();
				page.deleteModel();
			});

		} else {
			// no point in initializing the click handlers if we don't show the button
			$('#deleteTbPaymentsButtonContainer').hide();
		}
	},

	/**
	 * update the model that is currently displayed in the dialog
	 */
	updateModel: function() {
		// reset any previous errors
		$('#modelAlert').html('');
		$('.control-group').removeClass('error');
		$('.help-inline').html('');

		// if this is new then on success we need to add it to the collection
		var isNew = page.tbPayments.isNew();

		app.showProgress('modelLoader');

		page.tbPayments.save({

			'tbCityIdCity': $('select#tbCityIdCity').val(),
			'tbFunctionsIdFunction': $('select#tbFunctionsIdFunction').val(),
			'tbSubfunctionsIdSubfunction': $('select#tbSubfunctionsIdSubfunction').val(),
			'tbProgramIdProgram': $('select#tbProgramIdProgram').val(),
			'tbActionIdAction': $('select#tbActionIdAction').val(),
			'tbBeneficiariesIdBeneficiaries': $('select#tbBeneficiariesIdBeneficiaries').val(),
			'tbSourceIdSource': $('select#tbSourceIdSource').val(),
			'tbFilesIdFile': $('select#tbFilesIdFile').val(),
			'dbValue': $('input#dbValue').val()
		}, {
			wait: true,
			success: function(){
				$('#tbPaymentsDetailDialog').modal('hide');
				setTimeout("app.appendAlert('TbPayments was sucessfully " + (isNew ? "inserted" : "updated") + "','alert-success',3000,'collectionAlert')",500);
				app.hideProgress('modelLoader');

				// if the collection was initally new then we need to add it to the collection now
				if (isNew) { page.tbPaymentses.add(page.tbPayments) }

				if (model.reloadCollectionOnModelUpdate) {
					// re-fetch and render the collection after the model has been updated
					page.fetchTbPaymentses(page.fetchParams,true);
				}
		},
			error: function(model,response,scope){

				app.hideProgress('modelLoader');

				app.appendAlert(app.getErrorMessage(response), 'alert-error',0,'modelAlert');

				try {
					var json = $.parseJSON(response.responseText);

					if (json.errors) {
						$.each(json.errors, function(key, value) {
							$('#'+key+'InputContainer').addClass('error');
							$('#'+key+'InputContainer span.help-inline').html(value);
							$('#'+key+'InputContainer span.help-inline').show();
						});
					}
				} catch (e2) {
					if (console) console.log('error parsing server response: '+e2.message);
				}
			}
		});
	},

	/**
	 * delete the model that is currently displayed in the dialog
	 */
	deleteModel: function()	{
		// reset any previous errors
		$('#modelAlert').html('');

		app.showProgress('modelLoader');

		page.tbPayments.destroy({
			wait: true,
			success: function(){
				$('#tbPaymentsDetailDialog').modal('hide');
				setTimeout("app.appendAlert('The TbPayments record was deleted','alert-success',3000,'collectionAlert')",500);
				app.hideProgress('modelLoader');

				if (model.reloadCollectionOnModelUpdate) {
					// re-fetch and render the collection after the model has been updated
					page.fetchTbPaymentses(page.fetchParams,true);
				}
			},
			error: function(model,response,scope) {
				app.appendAlert(app.getErrorMessage(response), 'alert-error',0,'modelAlert');
				app.hideProgress('modelLoader');
			}
		});
	}
};

