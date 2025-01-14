
let current_rule_name = '';
let current_table = null;


let basepath = window.location
console.log(basepath['host'])

// Function to fetch columns for the selected table
function fetchColumns(tableName, callback) {
    fetch(`${basepath['host']}/get_columns/${tableName}`)
        .then(response => response.json())
        .then(columns => {
            callback(columns);
        })
        .catch(error => console.error('Error fetching columns:', error));
}

// Function to handle table selection
function selectTable() {
    // console.log(current_table)
    if(current_table){
        if(confirm("All your added rules for this table will be lost and cannot be recovered. Would you like to proceed?")){
            if(confirm("Are you sure?")){
            }
            else{
                document.getElementById('selectedTableName').value = current_table;
                return;
            }
        }
        else{
            document.getElementById('selectedTableName').value = current_table;
            return;
        }
    }
    current_table = document.getElementById('selectedTableName').value;
    const tableName = document.getElementById('selectedTableName').value;
    // Update the table name in the page title
    document.querySelector('h1').innerText = `Define Rules for ${tableName}`;
    // Fetch columns and update the column dropdowns
    fetchColumns(tableName, function(columns) {
        // Update existing column dropdowns
        const columnSelects = document.querySelectorAll('select[name="column"]');
        columnSelects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option disabled>Select a column</option>';
            columns.forEach(column => {
                const option = document.createElement('option');
                option.value = column;
                option.textContent = column;
                if (column === currentValue) {
                    option.selected = true;
                }
                select.appendChild(option);
                // select.setAttribute("disabled", "true");
            });
        });
    });
    const tableContainers = document.querySelectorAll('[id^="table--"]');

    tableContainers.forEach(tableContainer => {
        // console.log(tableContainer.id)
        if (tableContainer.id.startsWith(`table--${tableName}--`)) {
        tableContainer.classList.remove('d-none');
        } 
        else {
        tableContainer.classList.add('d-none');
        }
        if(tableContainer.parentElement.id === "confirmation--remove"){
            tableContainer.classList.remove('d-none');
        }
    });

}

// Function to handle table selection
function table_selection(tableSelectionId, columnSelectionId){
    const tableName = document.getElementById(tableSelectionId).value;
    fetchColumns(tableName, function(columns) {
        // Update existing column dropdowns
        // console.log(columnSelectionId);
        const columnSelects = document.getElementById(columnSelectionId);
        // console.log(columnSelects);
        columnSelects.innerHTML = '<option disabled>Select a column</option>';
        columns.forEach(column => {
                const option = document.createElement('option');
                option.value = column;
                option.textContent = column;

                columnSelects.appendChild(option);
                // select.setAttribute("disabled", "true");
            });
    });
}


// Function to add a new rule
function addRule(rule_name) {
    const tableName = document.getElementById('selectedTableName').value;
    if (tableName == 'Select a table to edit rules') {
        alert('Please select a table first.');
        return;
    }

    fetchColumns(tableName, function(columns) {
        ruleCount++;
        const options = columns.map(col => `<option value="${col}">${col}</option>`).join('');
        const ruleName = current_rule_name;
        const rulesHtml = {
        "between": `
            <div class="row g-3 align-items-center mb-3" id="rule-${ruleCount}">
                <div class="col-md-3 form-floating">
                    <select class="form-select form-select-sm" name="column" required>
                        <option selected disabled>Select a column</option>
                        ${options}
                    </select>
                    <label>column name</label>
                </div>
                <div class="col-md-2 form-floating">
                    <select class="form-select form-select-sm" name="DataType" required onchange="changeInputType('rule-${ruleCount}')">
                        <option selected>number</option>
                        <option>date</option>
                    </select>
                    <label>Data type</label>
                </div>
                <div class="col-md-3 form-floating">
                    <input type="number" class="form-control input-text" name="param1-min_value">
                    <label>Lower limit</label>
                </div>
                <div class="col-md-3 form-floating">
                    <input type="number" class="form-control input-text" name="param2-max_value">
                    <label>Upper limit</label>
                </div>
                <div>
                <p>Rule Categories:<p>
                <div style="display:flex; flex-direction:row;" name="param3-rule_categories">
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="completeness-rule-${ruleCount}" name="completeness" type="checkbox"/>
                    <label class="cbx" for="completeness-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Completeness</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="conformance-rule-${ruleCount}" name="conformance" type="checkbox"/>
                    <label class="cbx" for="conformance-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Conformance</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="temp_plausibility-rule-${ruleCount}" type="checkbox" name="temp_plausibility"/>
                    <label class="cbx" for="temp_plausibility-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Temporal Plausibility</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="atemp_plausibility-rule-${ruleCount}" type="checkbox" name="atemp_plausibility"/>
                    <label class="cbx" for="atemp_plausibility-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Atemporal Plausibility</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="col-md-2">
                    <button type="button" class="btn btn-danger" onclick="removeRule(${ruleCount})">Remove</button>
                </div>
            </div>`,
        "not_null": `
            <div class="row g-3 align-items-center mb-3" id="rule-${ruleCount}">
                <div class="col-md-3 col-lg-3 form-floating">
                    <select class="form-select form-select-sm" name="column" required>
                        <option selected disabled>Select a column</option>
                        ${options}
                    </select>
                    <label>column name</label>
                </div>
                <div>
                <p>Rule Categories:<p>
                <div style="display:flex; flex-direction:row;" name="param1-rule_categories">
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="completeness-rule-${ruleCount}" name="completeness" type="checkbox"/>
                    <label class="cbx" for="completeness-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Completeness</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="conformance-rule-${ruleCount}" name="conformance" type="checkbox"/>
                    <label class="cbx" for="conformance-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Conformance</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="temp_plausibility-rule-${ruleCount}" type="checkbox" name="temp_plausibility"/>
                    <label class="cbx" for="temp_plausibility-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Temporal Plausibility</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="atemp_plausibility-rule-${ruleCount}" type="checkbox" name="atemp_plausibility"/>
                    <label class="cbx" for="atemp_plausibility-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Atemporal Plausibility</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="col-lg-2">
                    <button type="button" class="btn btn-danger" onclick="removeRule(${ruleCount})">Remove</button>
                </div>
            </div>`,
        "accepted_values": `
            <div class="row g-3 align-items-center mb-3" id="rule-${ruleCount}">
                <div class="col-md-3 col-lg-3 form-floating">
                    <select class="form-select form-select-sm" name="column" required>
                        <option selected disabled>Select a column</option>
                        ${options}
                    </select>
                    <label>column name</label>
                </div>
                <div class="col-md-2 form-floating">
                    <select class="form-select form-select-sm" name="DataType" required onchange="changeInputType('rule-${ruleCount}')">
                        <option selected>number</option>
                        <option>text</option>
                    </select>
                    <label>Data type</label>
                </div>
                <div class="col-md-6 col-lg-6 form-floating">
                    Accepted values:
                    <div class="form-row values-wrapper" style="display:flex; flex-wrap:wrap; padding-bottom: 5px;">
                    <div class="col-md-3 col-lg-3 accepted_values_container" style="display:flex; margin:3px;">
                    <input type="number" class="form-control input-text" name="param1-accepted_values">
                    </div>
                    </div>
                    <button type="button" class="add-value-button btn btn-success btn-sm" onclick="addTextBox('rule-${ruleCount}')">Add Value</button>
                    <button type="button" class="remove-value-button btn btn-danger btn-sm" onclick="removeTextBox('rule-${ruleCount}')">Remove Value</button>

                </div>
                <div>
                <p>Rule Categories:<p>
                <div style="display:flex; flex-direction:row;" name="param1-rule_categories">
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="completeness-rule-${ruleCount}" name="completeness" type="checkbox"/>
                    <label class="cbx" for="completeness-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Completeness</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="conformance-rule-${ruleCount}" name="conformance" type="checkbox"/>
                    <label class="cbx" for="conformance-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Conformance</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="temp_plausibility-rule-${ruleCount}" type="checkbox" name="temp_plausibility"/>
                    <label class="cbx" for="temp_plausibility-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Temporal Plausibility</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="checkbox-wrapper-4">
                    <input class="inp-cbx" id="atemp_plausibility-rule-${ruleCount}" type="checkbox" name="atemp_plausibility"/>
                    <label class="cbx" for="atemp_plausibility-rule-${ruleCount}"><span>
                    <svg width="12px" height="10px">
                        <use xlink:href="#check-4"></use>
                    </svg></span><span>Atemporal Plausibility</span></label>
                    <svg class="inline-svg">
                        <symbol id="check-4" viewbox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                        </symbol>
                    </svg>
                    </div>
                <div class="col-lg-2">
                    <button type="button" class="btn btn-danger" onclick="removeRule(${ruleCount})">Remove</button>
                </div>
            </div>`}
        const ruleHtml = rulesHtml[ruleName];
        document.getElementById('addRuleButton--' + rule_name).insertAdjacentHTML('beforebegin', ruleHtml);
    });
}


function addTextBox(ruleId){
    const rule = document.getElementById(ruleId)
    const container = rule.querySelector('.values-wrapper')
    let input_boxes = container.querySelectorAll('.accepted_values_container');
    let lastInputBox = input_boxes[input_boxes.length - 1];

    // Create the new input
    let newInput = lastInputBox.cloneNode(true);
    newInput.querySelector(".form-control").value="";

    // Insert after the last input
    lastInputBox.insertAdjacentElement("afterend", newInput);
    
}

function removeTextBox(ruleId){
    const rule = document.getElementById(ruleId)
    const container = rule.querySelector('.values-wrapper')
    let input_boxes = container.querySelectorAll('.accepted_values_container');
    let lastInputBox = input_boxes[input_boxes.length - 1];

    if(input_boxes.length>1){
        lastInputBox.remove();
    }
    
    
}


function changeInputType(ruleId){
    const ParentNode = document.getElementById(ruleId)
    const ChangingObjects = ParentNode.querySelectorAll(".input-text")
    const dest_type = ParentNode.querySelector("[name='DataType']").value
    ChangingObjects.forEach(item => {
        item.type = dest_type
    })
}



function updateButtonOnclick(parentId) {
// Get the parent element by its ID
const parentElement = document.getElementById(parentId);
if (!parentElement) {
    console.error(`Element with id "${parentId}" not found.`);
    return;
}

// Find the last child within the parent element
const lastChild = parentElement.lastElementChild;
if (!lastChild) {
    console.error('No child elements found in the parent node.');
    return;
}

// Find the button within the last child (adjust based on your structure)
const button = lastChild.querySelector('button');
button.innerHTML = "UNDO";
if (!button) {
    console.error('Button not found within the last child element.');
    return;
}

// Update the `onclick` attribute
button.setAttribute('onclick', `undo('${parentId}')`);
}


// Function to remove a rule
function removeSavedRule(containerId, ruleName) {
    const ruleElement = document.getElementById(containerId);
    const clonedElement = ruleElement.cloneNode(true);
    ruleElement.classList.add("d-none");
    clonedElement.id = `removed--${clonedElement.id}`;
    clonedElement.style.paddingTop = '5px';
    // console.log(ruleElement)
    const confirmPage = document.getElementById("confirmation--remove");
    clonedElement.insertAdjacentHTML("afterbegin", `
        <div class="col-md-2 form-floating">
            <input type="text" class="form-control" name="" value="${ruleName}" disabled>
            <label>rule name</label>
        </div>
        <div class="col-md-2 form-floating">
            <input type="text" class="form-control" name="" value="${current_table}" disabled>
            <label>table</label>
        </div>
        `);
    // console.log(clonedElement);
    confirmPage.appendChild(clonedElement);
    updateButtonOnclick(clonedElement.id);
}


// Function to remove a rule
function undo(itemId) {
    const ruleElement = document.getElementById(itemId);
    ruleElement.remove();
    const originalElement = document.getElementById(removeWordFromStart(itemId, "removed--"));
    originalElement.classList.remove("d-none");
}


// Function to remove a rule
function removeRule(ruleId) {
    const ruleElement = document.getElementById(`rule-${ruleId}`);
    ruleElement.remove()
}


// Function to switch between rule tabs
function tabSwitch(tabName) {
    current_rule_name = tabName;
    const ruleContainers = document.querySelectorAll('[id^="rulesContainer--"]');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    ruleContainers.forEach(ruleContainer => {
        if (ruleContainer.id === `rulesContainer--${tabName}`) {
            ruleContainer.classList.remove('d-none');
        } else {
            ruleContainer.classList.add('d-none');
        }
    });

    dropdownItems.forEach(item => {
        if (item.id === `option--${tabName}`) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Form submission
document.getElementById('rulesForm').addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById("normal").classList.add("d-none");
    document.getElementById("confirmation").classList.remove("d-none");
    const newly_added_rules = document.querySelectorAll('[id^="rule-"]');
    const adding_page = document.getElementById("confirmation--add")
    newly_added_rules.forEach(added_rule_container =>{

        // Clone the node
        const cloned_add_rule = added_rule_container.cloneNode(true);

        // Remove the last child (as per your logic)
        cloned_add_rule.lastElementChild.remove();

        // Manually copy input values
        added_rule_container.querySelectorAll('input, select, textarea').forEach((originalElement, index) => {
            const clonedElement = cloned_add_rule.querySelectorAll('input, select, textarea')[index];
            if (clonedElement) {
                if (originalElement.type === 'checkbox' || originalElement.type === 'radio') {
                    clonedElement.checked = originalElement.checked; // Copy checked state
                } else {
                    clonedElement.value = originalElement.value; // Copy input value
                }
            }
        });

        // Disable the cloned inputs
        cloned_add_rule.querySelectorAll('input, select').forEach((child) => {
            child.disabled = true; // Disable input or select elements
            // console.log(child.value); // Now this will log the correct value
        });

        cloned_add_rule.querySelectorAll('.add-value-button, .remove-value-button').forEach(
            button=>{
                button.remove();
            }
        )


        cloned_add_rule.id = `cloned--${cloned_add_rule.id}`
        const parent_adding_rule = added_rule_container.parentElement
        cloned_add_rule.insertAdjacentHTML("afterbegin", `
        <div class="col-md-2 form-floating">
            <input type="text" class="form-control" name="" value="${removeWordFromStart(parent_adding_rule.id, 'rulesContainer--')}" disabled>
            <label>rule name</label>
        </div>
        <div class="col-md-2 form-floating">
            <input type="text" class="form-control" name="" value="${current_table}" disabled>
            <label>table</label>
        </div>
        `);
        adding_page.appendChild(cloned_add_rule);
    })
});

function cancel(){
    document.getElementById("normal").classList.remove("d-none");
    document.getElementById("confirmation").classList.add("d-none");
    const cloned_added_rules = document.querySelectorAll('[id^="cloned--rule-"]');
    cloned_added_rules.forEach(cloned_rule =>{
        cloned_rule.remove()
    })
}


function removeWordFromStart(string, word) {
    if (string.startsWith(word)) {
        return string.slice(word.length);
        }
    return string;
    }


function rule_cat_harvestor(object){
    console.log(object)
    console.log(object.querySelector('[name="completeness"]').checked)
    let tags = []
    if (object.querySelector('[name="completeness"]').checked){
        tags.push("completeness")
    }
    if (object.querySelector('[name="conformance"]').checked){
        tags.push("conformance")
    }
    if (object.querySelector('[name="temp_plausibility"]').checked){
        tags.push("temporal_plausibility")
    }
    if (object.querySelector('[name="atemp_plausibility"]').checked){
        tags.push("atemporal_plausibility")
    }
    return tags
}


function submission(){
    const removedRules = document.querySelectorAll('[id^="removed--"]');
    let removedRulesId = [];
    removedRules.forEach(removedRule => {
        // console.log(removedRule.id);
        removedRulesId.push(removedRule.id.split("--").pop());
    }
    )
    // console.log(removedRulesId);
    const tableName = document.getElementById('selectedTableName').value;
    if (tableName == 'Select a table to edit rules') {
        alert('Please select a table before submitting rules.');
        return;
    }

    const rules = [];
    const ruleContainers = document.querySelectorAll('[id^="rulesContainer--"]');
    let isValid = true;
    let param2 = null;
    let value_param1 = null, value_param2 = null, value_param3 = null, value_param4 = null, value_param5 = null;
    ruleContainers.forEach(ruleContainer => {
        const ruleName = ruleContainer.id.split('rulesContainer--')[1];
        const rows = ruleContainer.querySelectorAll('[id^="rule-"]');

        rows.forEach(row => {
            const columnSelect = row.querySelector('[name="column"]');
            let param1 = row.querySelector('[name^="param1-"]');
            if(param1){
                if (param1.getAttribute("name") == "param1-rule_categories"){
                    value_param1=rule_cat_harvestor(param1)
                    param1="tags"
                }
                else if(param1.name == "param1-accepted_values"){
                    let param1s = row.querySelectorAll('[name="param1-accepted_values"]')
                    let datatype = row.querySelector('[name="DataType"]').value
                    if (datatype == "text") {
                        value_param1 = Array.from(param1s)
                            .filter(param => param.value !== "")
                            .map(param => param.value);
                    }
                    else if (datatype == "number") {
                        value_param1 = Array.from(param1s)
                            .filter(param => param.value !== "")
                            .map(param => Number(param.value));
                    }
                    param1="values";


                }
                else {
                if(param1.value){
                    if (Number.isNaN(Number(param1.value))){
                        value_param1 = param1.value;
                    }
                    else{
                        value_param1 = Number(param1.value);
                }
                    param1 = removeWordFromStart(param1.name, "param1-");
                }
                else{
                    param1=null;
                }
            }
            }
            let param2 = row.querySelector('[name^="param2-"]');
            if(param2){
                if (param2.getAttribute("name") == "param2-rule_categories"){
                    value_param2=rule_cat_harvestor(param2)
                    param2="tags"
                }
                else {
                    if(param2.value){
                    if (Number.isNaN(Number(param2.value))){
                        value_param2 = param2.value;
                    }
                    else{
                        value_param2 = Number(param2.value);
                }
                    param2 = removeWordFromStart(param2.name, "param2-");
                }
                else{
                    param2=null;
                }
            }
            }
            let param3 = row.querySelector('[name^="param3-"]');
            if(param3){
                if (param3.getAttribute("name") == "param3-rule_categories"){
                    value_param3=rule_cat_harvestor(param3)
                    param3="tags"
                }
                else {
                    if(param3.value){
                    if (Number.isNaN(Number(param3.value))){
                        value_param3 = param3.value;
                    }
                    else{
                        value_param3 = Number(param3.value);
                }
                    param3 = removeWordFromStart(param3.name, "param3-");
                }
                else{
                    param3=null;
                }
            }
            }
            let param4 = row.querySelector('[name^="param4-"]');
            if(param4){
                if (param4.getAttribute("name") == "param4-rule_categories"){
                    value_param4=rule_cat_harvestor(param4)
                    param4="tags"
                }
                else {
                    if(param4.value){
                    if (Number.isNaN(Number(param4.value))){
                        value_param4 = param4.value;
                    }
                    else{
                        value_param4 = Number(param4.value);
                }
                    param4 = removeWordFromStart(param4.name, "param4-");
                }
                else{
                    param4=null;
                }
            }
            }
            let param5 = row.querySelector('[name^="param5-"]');
            if(param5){
                if (param5.getAttribute("name") == "param5-rule_categories"){
                    value_param5=rule_cat_harvestor(param5)
                    param5="tags"
                }
                else {
                    if(param5.value){
                    if (Number.isNaN(Number(param5.value))){
                        value_param5 = param5.value;
                    }
                    else{
                        value_param5= Number(param5.value);
                }
                    param5 = removeWordFromStart(param5.name, "param5-");
                }
                else{
                    param5=null;
                }
            }
            }

            if(columnSelect.value === 'Select a column') {
                alert('Please select a column.');
                isValid = false;
                return;
            }
            if(row.querySelector('[name="DataType"]') != null){
                
                if(row.querySelector('[name="DataType"]').value=='number' && ruleName==='accepted_values'){
                    param2="quote";
                    value_param2=false;
                }
            }

            
            
            rules.push({
                ruleName,
                tableName,
                columnName: columnSelect.value,
                param1: param1,
                value_param1: value_param1,
                param2: param2,
                value_param2: value_param2,
                param3: param3,
                value_param3: value_param3,
                param4: param4,
                value_param4: value_param4,
                param5: param5,
                value_param5: value_param5,
            });
            // console.log(rules)
        });
    });

    if (!isValid) return;

    console.log(rules);

    fetch(`${basepath['host']}/save_rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules }),
    })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error:', error));
        
    fetch(`${basepath['host']}/remove_rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ removedRulesId }),
    })
        .then(response => response.json())
        .then(data => alert(data.message))
        .catch(error => console.error('Error:', error));

    fetch('/create_config_file', {
        method: 'GET',})
        .then(response => response.json())
        .then(data => {alert(data.message);
        window.location.reload(true);})
        .catch(error => console.error('Error:', error));
    
    
}