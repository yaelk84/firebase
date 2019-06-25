 function () {
    'use strict';

    return app.directive('selectAutocomplete', ['$timeout', 'eventBusService', function ($timeout, eventBusService) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                id: '@',                 //OPTIONAL - select element id, if use event bus this is required
                data: '=?',              //OPTIONAL - data array (if not existing ajax will be required)
                freeText: '=?',          //OPTIONAL - true\false, allow free text input (DEFAULT false)
                searchKey: '@',          //OPTIONAL - key of the search text inside data. will search only on this key (DEFAULT text)
                idKey: '@',              //OPTIONAL - key of the id inside data(DEFAULT text)
                selectedObj: '=?',       //OPTIONAL - selected object binded
                selectedCb: '&',         //OPTIOANL - selected callback function - receiving the selected object (if free text it will receive the text)
                autoSelectValue: '@?',   //OPTIOANL - auto select. the selection is by id. i.e. {id: 1, value: 'test'} then autoSelectValue="{{selectedObj.id}}"
                placeholder: '@',        //OPTIONAL - placeholder for the input
                alphabetic: '@',         //OPTIONAL - order the results alphabetically or not. (DEFAULT FALSE)
                customTemplate: '&',     //OPTIONAL - custom template callback
                useCustomTemplate: '@',  //OPTIONAL - use custom template or not
                cssClass: '@',           //OPTIONAL - extra css class on autocomplete wrapper
                searchOnStart: '@',      //OPTIONAL - search only on the begining of the word,
                searchOnMultipleChoice: '@',//OPTIONAL - search from  multiple choice that need to Separated by a comma,
                autoMatch: '=',          //OPTIONAL - auto match if there is only one result,
                isDisabled: '=',           //OPTIONAL - if the directive is disables (default false, two way binding)
                maxlength: '@',          //OPTIONAL - max length of the input
                autoMatchOnFree: '=',
               minInputLength: '@',          //OPTIONAL -min Input Length of search to start search
            },
            template: '<div class="autocomplete-wrapper {{cssClass}}"><select ng-attr-id="{{id}}"></select></div>',
            link: function (scope, element) {

                var newData;

                var selectElem = jquery(element).find('select');

                /**
                 * map received data to be with keys id and text
                 * @return void
                 */
                function mapData() {

                    var needMapping = scope.searchKey || scope.idKey;

                    scope.searchKey = scope.searchKey || 'text';
                    scope.idKey     = scope.idKey || 'id';

                    if (needMapping) {

                        newData = jquery.map(scope.data, function (obj) {
                            return {
                                id: obj.id = obj[scope.idKey],
                                text: obj.text = obj[scope.searchKey],
                                original: obj
                            };
                        });

                    } else {
                        newData = scope.data;
                    }
                }

                /**
                 * initialize select plugin
                 * @return void
                 */
                function initSelect() {
                    jquery.fn.select2.amd.require([
                        'select2/selection/multiple',
                        'select2/selection/search',
                        'select2/dropdown',
                        'select2/dropdown/attachBody',
                        'select2/dropdown/closeOnSelect',
                        'select2/compat/containerCss',
                        'select2/utils',
                        'select2/data/tags',
                        'select2/data/array',
                        'select2/selection/eventRelay',
                        'select2/selection/allowClear'
                    ], function (MultipleSelection, Search, Dropdown, AttachBody, CloseOnSelect, ContainerCss, Utils, Tags, ArrayData, EventRelay, AllowClear) {

                        var SelectionAdapter = Utils.Decorate(
                            Utils.Decorate(
                                MultipleSelection,
                                Search
                            ),
                            EventRelay
                        );

                        SelectionAdapter = Utils.Decorate(SelectionAdapter, AllowClear);

                        var DropdownAdapter = Utils.Decorate(
                            Utils.Decorate(
                                Dropdown,
                                CloseOnSelect
                            ),
                            AttachBody
                        );


                        var DataAdapter;
                        if (scope.freeText) {

                            DataAdapter = Utils.Decorate(ArrayData, Tags);
                       } else {
                            DataAdapter = ArrayData;
                        }

                        var select2Options = {
                            dropdownAdapter: DropdownAdapter,
                            selectionAdapter: Utils.Decorate(SelectionAdapter, ContainerCss),
                            dataAdapter: DataAdapter,
                            dropdownParent: jquery(element).find('.autocomplete-wrapper'),
                            allowClear: true,
                            createTag: function (params) {
                                var term = jquery.trim(params.term);

                                if (term === '') {
                                    return null;
                                }

                                return {
                                    id: term,
                                    text: term,
                                    newTag: true
                                };

                            },
                            data: newData,
                            selectOnClose: true,
                            dir: "rtl"
                        };

                        if (scope.alphabetic === 'true') {
                            select2Options.sorter = getSort;
                        }

                        if(scope.minInputLength){
                            select2Options.matcher =matcherMinInputLength;
                        }
                        if (scope.searchOnStart === 'true' ) {
                            select2Options.matcher = matchStart;
                        }

                        if (scope.searchOnMultipleChoice === 'true') {
                            select2Options.matcher = matchFromMultipleChoice;
                        }

                        if (scope.useCustomTemplate === 'true') {
                            select2Options.templateResult = customFunc;
                        }

                        jquery(selectElem).select2(select2Options);

                        if (scope.placeholder) {
                            jquery(element).find('.select2-search__field').attr('placeholder', scope.placeholder);
                        }

                        if (scope.isDisabled) {
                            jquery(selectElem).prop('disabled', true);
                        } else {
                            jquery(selectElem).prop('disabled', false);
                        }

                        if (scope.autoSelectValue) {
                            eventBusService.publish('selectAutocompleteSetValue', [scope.id, scope.autoSelectValue]);
                        }

                        if (scope.maxlength) {
                            jquery(element).find('.select2-search__field').attr('maxlength', scope.maxlength);
                        }

                        if(!newData || newData.length === 0) {
                            jquery(element).find('.select2-selection').addClass('no-results');
                        } else {
                            jquery(element).find('.select2-selection').removeClass('no-results');
                        }

                    });
                }

                /**
                 * Custom template function - call the template only on received and existing object
                 * @param {object} obj - result object
                 * @returns {html} template results
                 */
                function customFunc(obj) {

                    if (obj.loading) {
                        return '';
                    }

                    if (obj.newTag) {
                        return obj.text;
                    }
                    if (obj.children && !obj.children.length) {
                        return;
                    }

                    return jquery(scope.customTemplate({ obj: obj }));
                }
                /**
                 * start search after n char
                 * @param {object} params - params as received from select2 plugin
                 * @param {array} data - data array as received from select2
                 * @returns {array} match array of objects
                 */
               function matcherMinInputLength (params, data) {
        function stripDiacritics (text) {
            // Used 'uni range + named function' from http://jsperf.com/diacritics/18
            function match(a) {
                return a;
            }

            return text.replace(/[^\u0000-\u007E]/g, match);
        }
                    // Always return the object if there is nothing to compare
                    if (jquery.trim(params.term) === '' ||( scope.minInputLength && jquery.trim(params.term).length <=scope.minInputLength)) {
                        return data;
                    }

                    // Do a recursive check for options with children
                    if (data.children && data.children.length > 0) {
                        // Clone the data object if there are children
                        // This is required as we modify the object to remove any non-matches
                        var match = jquery.extend(true, {}, data);

                        // Check each child of the option
                        for (var c = data.children.length - 1; c >= 0; c--) {
                            var child = data.children[c];

                            var matches = matcherMinInputLength(params, child);

                            // If there wasn't a match, remove the object in the array
                            if (matches == null) {
                                match.children.splice(c, 1);
                            }
                        }

                        // If any children matched, return the new object
                        if (match.children.length > 0) {
                            return match;
                        }

                        // If there were no matching children, check just the plain object
                        return matcherMinInputLength(params, match);
                    }

                    var original = stripDiacritics(data.text).toUpperCase();
                    var term = stripDiacritics(params.term).toUpperCase();

                    // Check if the text contains the term
                    if (original.indexOf(term) > -1) {
                        return data;
                    }

                    // If it doesn't contain the term, don't return anything
                    return null;
                }
                /**
                 * match search when only existing on the start
                 * @param {object} params - params as received from select2 plugin
                 * @param {array} data - data array as received from select2
                 * @returns {array} match array of objects
                 */
                function matchStart(params, data) {
                    // If there are no search terms, return all of the data
                    if (jquery.trim(params.term) === '' ||  scope.minInputLength && jquery.trim(params.term).length <=scope.minInputLength) {
                        return data;
                    }

                    // Skip if there is no 'children' property
                    if (typeof data.children === 'undefined') {
                        return null;
                    }

                    // `data.children` contains the actual options that we are matching against
                    var filteredChildren = [];
                    jquery.each(data.children, function (idx, child) {
                        if (child.text.toUpperCase().indexOf(params.term.toUpperCase()) == 0) {
                            filteredChildren.push(child);
                        }
                    });

                    // If we matched any of the timezone group's children, then set the matched children on the group
                    // and return the group object
                    if (filteredChildren.length) {
                        var modifiedData      = jquery.extend({}, data, true);
                        modifiedData.children = filteredChildren;

                        // You can return modified objects from here
                        // This includes matching the `children` how you want in nested data sets
                        return modifiedData;
                    }

                    // Return `null` if the term should not be displayed
                    return null;
                }


                function matchFromMultipleChoice(params, data) {
                    function stripDiacritics (text) {
                        // Used 'uni range + named function' from http://jsperf.com/diacritics/18
                        function match(a) {
                            return a;
                        }

                        return text.replace(/[^\u0000-\u007E]/g, match);
                    }

                    // Always return the object if there is nothing to compare
                    if (jquery.trim(params.term) === '' || scope.minInputLength && jquery.trim(params.term).length <=scope.minInputLength) {
                        return data;
                    }
                    // Do a recursive check for options with children
                    if (data.children && data.children.length > 0) {
                        // Clone the data object if there are children
                        // This is required as we modify the object to remove any non-matches
                        var match = jquery.extend(true, {}, data);

                        // Check each child of the option
                        for (var c = data.children.length - 1; c >= 0; c--) {
                            var child = data.children[c];

                            var matches = matchFromMultipleChoice(params, child);

                            // If there wasn't a match, remove the object in the array
                            if (matches == null) {
                                match.children.splice(c, 1);
                            }
                        }

                        // If any children matched, return the new object
                        if (match.children.length > 0) {
                            return match;
                        }

                        // If there were no matching children, check just the plain object
                        return matchFromMultipleChoice(params, match);
                    }

                    var original = stripDiacritics(data.text).toUpperCase();
                    var term     = stripDiacritics(params.term).toUpperCase();
                    var searchArray = original.split(",");
                    if (searchArray && searchArray.length > 0) {
                        searchArray.forEach(function (searchItem) {
                            if (searchItem.indexOf(term) > -1) {
                                return data;
                            }
                        });
                    }

                    // Check if the text contains the term
                    if (original.indexOf(term) > -1) {
                        return data;
                    }

                    // If it doesn't contain the term, don't return anything
                    return null;
                }
                function addRemoveClearBtn(value){

                    if (value.length>0){
                        jquery(element).find('.select2-selection__clear_auto').addClass('active');
                    }
                    else{
                        jquery(element).find('.select2-selection__clear_auto').removeClass('active');
                    }
                }
                /**
                 * sorting data alphabetically
                 * @param {object} data - results received data from select2
                 * @return {number} - is the item before, after or at the same place
                 */
                function getSort(data) {

                    return data.sort(function (a, b) {
                        if (a.text > b.text) {
                            return 1;
                        }
                        if (a.text < b.text) {
                            return -1;
                        }

                        return 0;
                    });
                }

                /**
                 * select item when the dropdown is closed if nothing has been selected before
                 * @return void
                 */
                function selectOnClose() {

                    if (jquery(element).find('.select2-search__field').attr('has-selection') === 'true') {
                        return;
                    }

                    var children = jquery(element).find('.select2-results__option[aria-selected]');
                    var newVal;

                    if (children.length > 1 && !scope.freeText) {
                        updateValue(undefined, true, false);
                        return;
                    }

                    if (children.length === 0 || (!scope.autoMatch && !scope.freeText)) {
                        updateValue(undefined, true, false);
                        return;
                    }


                    var newTag = false;
                    if (children.length === 1) {
                        newVal = children[0].dataset.value;
                        newTag = scope.freeText;
                        jquery(children[0]).addClass('select2-results__option--highlighted');
                    } else if(children.length === 2 && ((!scope.freeText && scope.autoMatch) || (scope.freeText && scope.autoMatchOnFree))) {
                        //if there is no free text select the value that not free text
                        if(children[0].classList.contains('.hidden')) {
                            newVal = children[0].dataset.value;
                            jquery(children[0]).addClass('select2-results__option--highlighted');
                        } else {
                            newVal = children[1].dataset.value;
                            jquery(children[1]).addClass('select2-results__option--highlighted');
                        }

                    } else {

                        //select the free text label
                        for (var i = 0; i < children.length; i++) {
                            var child = children[i];
                                if(jquery(child).hasClass('hidden')) {
                                    newVal = child.dataset.value;
                                    newTag = true;
                                    jquery(child).addClass('select2-results__option--highlighted');
                                }

                        }

                    }

                    updateValue(newVal, true, newTag);

                }

               /**
                * update select 2 value
                 * @param {string|undefined} newVal - new select 2 value
                 * @param {boolean|undefined} sendEvent - send event about selecting value even if undefined
                 * @param {boolean|undefined} isNewTag - is new tag
                 * @return void
                 */
                function updateValue(newVal, sendEvent, isNewTag) {
                    $timeout(function(){
                        if(isNewTag && angular.isDefined(newVal)) {
                            handleSelectedObj({id:newVal, text:newVal, newTag:true});
                        }
                        jquery(selectElem).val(newVal).trigger('change');
                    },5);

                    if(!angular.isDefined(newVal) && sendEvent) {
                        handleSelectedObj(newVal);
                    }
                }

                /**
                 * Add all events listeners of select2 and external event bus
                 * @return void
                 */
                function listenToEvents() {

                    scope.$watch('isDisabled', function(nv, ol) {
                        if(ol !== nv && angular.isDefined(nv)) {
                            jquery(selectElem).prop('disabled', nv);
                        }
                    });
                    
                    scope.$watch('data', function(nv, ol){
                       if(!angular.equals(nv, ol)) {
                           mapData();
                           initSelect();
                       }
                    });

                    jquery(selectElem).on('select2:closing',function(){
                        selectOnClose();
                    });


                    jquery(selectElem).on('select2:open', function (e) {


                        $timeout(function(){

                            function handleClear(evt){
                                // Ignore the event if it is disabled
                                if (scope.isDisabled) {
                                    return;
                                }

                                var $clear =  jquery(element).find('.select2-selection__clear_auto');
                                // Ignore the event if nothing has been selected
                                if ($clear.length === 0) {
                                    return;
                                }

                                evt.stopPropagation();
                                addRemoveClearBtn('');

                           }
                            var searchField=jquery(element).find('li.select2-search');
                            var clearBtn =angular.element(searchField).find('.select2-selection__clear_auto');
                            if(!angular.element(searchField).find('.select2-selection__clear_auto').length){
                                var remove = jquery(
                                    '<span class="select2-selection__clear_auto">' +
                                    '&times;' +
                                    '</span>'
                                );


                               searchField.prepend(remove);
                            }
                            searchField.on('keyup', function (e) {

                                addRemoveClearBtn(searchField.find('input').val());
                            });
                            clearBtn.on('click',function(e){
                                 handleClear(e);
                            })

                            jquery(element).find('.select2-results__options').niceScroll();
                        },1);

                    });

                    jquery(selectElem).on('select2:select',function(evt) {
                        handleSelectedObj(evt.params.data);
                        debugger
                        addRemoveClearBtn(scope.selectedObject.text);

                    });

                    eventBusService.subscribe('selectAutocompleteSetValue','selectAutocompleteSetValue' + scope.id, function(id, val, text){
                        if(scope.id === id) {
                            if(jquery(selectElem).find("option[value='" + val + "']").length === 0 && text) {
                                if(!text) {
                                    text = id;
                                }

                                var newOption = new Option(text, id, true, true);
                                jquery(selectElem).append(newOption).trigger('change');
                            } else {
                                jquery(selectElem).val(val).trigger('change');
                            }
                        }
                    });

                }

                /**
                 * After object selected set the original object and fire events
                 * @param {object} obj - selected object
                 * @return void
                 */
                function handleSelectedObj(obj) {

                    var selectedObj = obj;
                    if(angular.isDefined(obj)) {
                        if(obj.newTag && !scope.freeText) {
                            selectedObj = null;
                        } else if(obj.original) {
                            selectedObj = obj.original;
                        } else {
                            selectedObj = obj;
                        }
                    }

                    scope.selectedObject = selectedObj;
                    if(angular.isFunction(scope.selectedCb)) {
                        scope.selectedCb({selected:selectedObj});
                    }

                }

                /**
                 * init directive
                 * @return void
                 */
                function init() {

                    if(scope.data) {
                        mapData();
                    }

                    initSelect();
                    if (!scope.autoSelectValue || scope.autoSelectValue === '') {
                        updateValue(undefined, false);
                    }
                    listenToEvents();
                }

                init();

           }
        };
    }]);
