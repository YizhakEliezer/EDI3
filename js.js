//myArray result
let myArray = [];
//myArray for data file
let fileContentSearch;




//ondrop file
function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    handleFiles(files);

}

function handleFileInput(event) {
    const files = event.target.files;
    handleFiles(files);


}




//name file
function handleFiles(files) {
    myArraymessageRusltFromFile=[];
    myArray = []; // Clear myArray before processing each file
    const fileName = files[0].name;
    document.getElementById('file-name').innerText = ` ${fileName}`;
    checkForValue(files[0]);
}

//input file
function triggerFileInput() {
    document.getElementById('file-input').click();
}





//read file and save in variable fileContentSearch
function checkForValue(file) {
    const reader = new FileReader();
    reader.onload = function (event) {

        const fileContent = event.target.result;
        fileContentSearch = fileContent;

        //Check the selected file structure type and run the appropriate function
        var selectedOption = document.getElementById("menuTypeStructure").value;
        if (selectedOption === "fileStructure") {
            alert("לא נבחר מבנה המסר לבדיקה");
        } else if (selectedOption === "fletFile") {
            chekFileFletSupdes();
        }
        else if (selectedOption === "hashavshevt") {
            chekFileHashavshevtSupdes();
        }


    };
    reader.readAsText(file);
}








//add to myArray result variable and chek if the file is fix
function addElement(value) {
    if (value.includes("תעודה תקינה")) {
        myArray.push(value);
        messageRusltFix();
    } else {
        myArray.push(value);
        messageRuslt();
    }
}



//messageRuslt eror
function messageRuslt() {
    // Get the div element
    const messageRuslt = document.getElementById('messageRuslt');
    // Clear the existing content
    messageRuslt.innerHTML = "";
    myArray.forEach(function (element) {
        messageRuslt.innerHTML += `<p>${element}-</p>`;

    });

}



//messageRuslt fix
function messageRusltFix() {
    // Get the div element
    const messageRuslt = document.getElementById('messageRuslt');
    // Clear the existing content
    messageRuslt.innerHTML = "";
    myArray.forEach(function (element) {
        messageRuslt.innerHTML += `<p style="color: #79acf1;font-size: 25px;position: relative;text-align: center;top: 60px">${element}</p>`;
    });

}







//function to chekFile
function chekFileFletSupdes() {

    const splitSupdes = fileContentSearch.match(/ENV00101[^]*?(?=ENV00101|$)/g);

    const numRetailer = document.getElementById('retailer').value.toLowerCase();
    const numSupplier = document.getElementById('supplier').value;
    const numMessage = document.getElementById('message').value;
    const numSupplierSubnetNumber = document.getElementById('supplierSubnetNumber').value;
    const numBranchRetailer = document.getElementById('branchRetailer').value;

    if (splitSupdes.length>1){
        // alert("נראה שמדובר בתעודות מרובות,לכן הזן את מספר התעודה שברצונך לבדוק")
        addElement("נראה שמדובר בתעודות מרובות,לכן הזן את מספר התעודה שברצונך לבדוק");
    }

    // alert(splitSupdes.length)

    let numsplitSupdes;

    for (let k = 0; k <splitSupdes.length ; k++) {

        if (splitSupdes[k].includes(numMessage)) {
            console.log(splitSupdes[k])
            numsplitSupdes = k;
        }

    }


        const lines = splitSupdes[numsplitSupdes].split('\n');
        const secondToLastLine = lines[lines.length - 2];



        myArray = [];
        myArraymessageRusltFromFile = [];

        function compareStringsIgnoreCaseAndSpace(valueFromFile, constantValue) {
            // Check if value is defined and not empty
            if (valueFromFile === undefined || valueFromFile.trim() === "") {
                return false;
            }
            // Remove spaces from both the value and target strings
            const formattedValue = valueFromFile.trim();
            const formattedTarget = constantValue.trim();

            // Check if the formatted value is exactly equal to the formatted target
            return formattedTarget === formattedValue;
        }


        function supplierSubnetNumber(supplierSubnetNumber, supplierNumber) {
            if (supplierSubnetNumber === "") {
                return true;
            }
            return false;
        }





        //constant values line 1
        const ENV00101 = "ENV00101";
        const nameDocument = "MMDE02L";
        const nameDocument2 = "MMDE02R";
        const typeDocument = "SUPDES";
        //constant values line 2
        const HEAD0101 = "HEAD0101";
        //constant values line 3
        const LINE0001 = "LINE0001";
        //constant values line 4
        const LINE0101 = "LINE0101";


        //constant values Barcode
        const LINE0201 = "LINE0201";

        //constant values One line before last
        const HEAD9901 = "HEAD9901";
        //constant values last line
        const ENV00201 = "ENV00201";


        let constantValuesBarcodeBoolean = true;
        let ItemDataBoolean = true;

        function constantValuesBarcode() {
            for (let i = 3; i < lines.length - 3; i++) {
                const BarcodeArryStartOfLine = splitSupdes[numsplitSupdes].split('\n')[i].substring(0, 8);
                if (compareStringsIgnoreCaseAndSpace(BarcodeArryStartOfLine, LINE0201)) {

                } else {
                    if (compareStringsIgnoreCaseAndSpace(BarcodeArryStartOfLine, LINE0101)) {
                        const surfaceIdentificationNumber = splitSupdes[numsplitSupdes].split('\n')[i].substring(50, 68);
                        if (surfaceIdentificationNumber.trim() === "") {
                            ItemDataBoolean = false;
                            addElement("מספר זיהוי משטח חסר " + (i + 1))
                        }
                    } else {
                        constantValuesBarcodeBoolean = false;
                        addElement("תחילית מקט חסר שורה " + (i + 1))
                    }
                }
            }
        }


        // function for checking the c Values of  barcodes is not empty or with spaces
        let valuesBarcodeBoolean = true;

        function valuesBarcode() {
            for (let r = 3; r < lines.length - 3; r++) {
                const BarcodeArryStartOfLine = splitSupdes[numsplitSupdes].split('\n')[r].substring(0, 8);
                if (compareStringsIgnoreCaseAndSpace(BarcodeArryStartOfLine, LINE0101)) {
                    r++
                }
                const barcodeEmpty = splitSupdes[numsplitSupdes].split('\n')[r].substring(8, 9);
                const barcodeWithspaces = splitSupdes[numsplitSupdes].split('\n')[r].substring(9, 22);
                const mbarcodeWithspacesValue = barcodeWithspaces;
                if (barcodeEmpty.trim() === "") {
                    valuesBarcodeBoolean = false;
                    addElement("ברקוד חסר או שגוי שורה " + (r + 1));

                } else {

                    for (let i = 0; i < mbarcodeWithspacesValue.length; i++) {

                        if (mbarcodeWithspacesValue[i].trim() === "") {

                            for (let j = i + 1; j < mbarcodeWithspacesValue.length; j++) {
                                if (mbarcodeWithspacesValue[j].trim() === "") {

                                } else {
                                    valuesBarcodeBoolean = false;
                                    addElement("ברקוד חסר או שגוי שורה " + (r + 1));
                                    break;
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }


        //chek barcode is validi
        constantValuesBarcode()
        valuesBarcode()


        //valueFromFile line 1
        const generalLineHeader = splitSupdes[numsplitSupdes].split('\n')[0].substring(0, 8);
        const isValidNumRetailer = splitSupdes[numsplitSupdes].split('\n')[0].substring(8, 23);
        const MMDE02L = splitSupdes[numsplitSupdes].split('\n')[0].substring(23, 33);
        const MMDE02R = splitSupdes[numsplitSupdes].split('\n')[0].substring(23, 33);
        const SUPDES = splitSupdes[numsplitSupdes].split('\n')[0].substring(33, 47);
        const isValidNumSupplier = splitSupdes[numsplitSupdes].split('\n')[0].substring(49, 64);


        //valueFromFile line 2
        const firstLineDetailsFile = splitSupdes[numsplitSupdes].split('\n')[1].substring(0, 8);
        const isValidNumMessage = splitSupdes[numsplitSupdes].split('\n')[1].substring(8, 23);


        //time value
        const timeDocument = splitSupdes[numsplitSupdes].split('\n')[1].substring(23, 35).trim();
        const timeDocumentLength = 12;
        const booleneLength = timeDocument.length === timeDocumentLength;
        const year = Number(timeDocument.substring(0, 4));
        const month = Number(timeDocument.substring(4, 6));
        const day = Number(timeDocument.substring(6, 8));
        const hour = Number(timeDocument.substring(8, 10));
        const minute = Number(timeDocument.substring(10, 12));


        //NumSupplierSubnetNumber+NumBranchRetailer
        const isValidNumSupplierSubnetNumber = splitSupdes[numsplitSupdes].split('\n')[1].substring(104, 119);
        const isValidNumBranchRetailer = splitSupdes[numsplitSupdes].split('\n')[1].substring(154, 169);


        //valueFromFile line 3
        const firstLine3row = splitSupdes[numsplitSupdes].split('\n')[2].substring(0, 8);


        //valueFromFile One line before last
        const lestline = splitSupdes[numsplitSupdes].split('\n')[lines.length - 3].substring(0, 8);
        //valueFromFile last line
        const lestline1 = splitSupdes[numsplitSupdes].split('\n')[lines.length - 2].substring(0, 8);


        if (
            //line 1
            compareStringsIgnoreCaseAndSpace(generalLineHeader, ENV00101) &&
            compareStringsIgnoreCaseAndSpace(isValidNumRetailer, numRetailer) &&
            (compareStringsIgnoreCaseAndSpace(nameDocument, MMDE02L) ||
                compareStringsIgnoreCaseAndSpace(nameDocument2, MMDE02R)) &&
            compareStringsIgnoreCaseAndSpace(SUPDES, typeDocument) &&
            compareStringsIgnoreCaseAndSpace(isValidNumSupplier, numSupplier) &&
            //line 2
            compareStringsIgnoreCaseAndSpace(firstLineDetailsFile, HEAD0101) &&

            (isValidNumMessage.trim() != "" && numMessage.trim() === "" || isValidNumMessage.trim().includes(numMessage.trim())) &&

            booleneLength === true &&
            (year => 2023 && month > 1 && month <= 12 && day > 1 && day <= 31 && hour > 0 && hour <= 24 &&
                minute > 0 && minute <= 59)
            &&

            (numSupplierSubnetNumber.trim() === "" &&
                compareStringsIgnoreCaseAndSpace(isValidNumSupplierSubnetNumber, numSupplier) ||
                numSupplierSubnetNumber.trim() != "" &&
                compareStringsIgnoreCaseAndSpace(isValidNumSupplierSubnetNumber, numSupplierSubnetNumber)
            )

            &&

            (numBranchRetailer.trim() === "" ||
                numBranchRetailer.trim() != "" &&
                compareStringsIgnoreCaseAndSpace(isValidNumBranchRetailer, numBranchRetailer)
            )

            &&

            //line 3
            compareStringsIgnoreCaseAndSpace(firstLine3row, LINE0001) &&


            //barcode
            constantValuesBarcodeBoolean === true && valuesBarcodeBoolean === true && ItemDataBoolean === true &&
            compareStringsIgnoreCaseAndSpace(lestline, HEAD9901) &&
            compareStringsIgnoreCaseAndSpace(lestline1, ENV00201)


        ) {
            addElement("תעודה תקינה");
        }


        //line 1
        if (!compareStringsIgnoreCaseAndSpace(generalLineHeader, ENV00101)) {
            addElement('ENV00101-ערך חסר');
        }

        if (!compareStringsIgnoreCaseAndSpace(isValidNumRetailer, numRetailer)) {
            addElement('מספר רשת שגוי');
        }
        if (!compareStringsIgnoreCaseAndSpace(MMDE02L, nameDocument) &&
            !compareStringsIgnoreCaseAndSpace(MMDE02R, nameDocument2)) {
            addElement("MMDE02L-ערך חסר ");
        }
        if (!compareStringsIgnoreCaseAndSpace(SUPDES, typeDocument)) {
            addElement('SUPDES-ערך חסר');
        }
        if (!compareStringsIgnoreCaseAndSpace(isValidNumSupplier, numSupplier)) {
            addElement('מספר ספק שגוי');
        }


        //line 2
        if (!compareStringsIgnoreCaseAndSpace(firstLineDetailsFile, HEAD0101)) {
            addElement('HEAD0101-ערך חסר');
        }


        if (isValidNumMessage.trim() === "" || numMessage.trim() != "" &&
            !isValidNumMessage.trim().includes(numMessage.trim())) {
            addElement('מספר תעודה שגוי');
        }


        if (booleneLength === false || isNaN(booleneLength)) {
            addElement('פורמט תאריך  שגוי');
        }

        if (year < 2023 || isNaN(year)) {
            addElement('פורמט תאריך שנה שגוי');
        }
        if (month < 1 || month > 12 || isNaN(month)) {
            addElement('פורמט תאריך חודש שגוי');
        }
        if (day < 1 || day > 31 || isNaN(day)) {
            addElement('פורמט תאריך יום שגוי');
        }
        if (hour < 0 || hour > 24 || isNaN(hour)) {
            addElement('פורמט תאריך שעה שגוי');
        }
        if (minute < 0 || minute > 59 || isNaN(minute)) {
            addElement('פורמט תאריך דקה שגוי');
        }


        if (numSupplierSubnetNumber.trim() === "" && !compareStringsIgnoreCaseAndSpace(isValidNumSupplierSubnetNumber, numSupplier)) {
            addElement('מספר ספק משני/תת ספק שגוי או חסר');
        }

        if (numSupplierSubnetNumber.trim() != "" && !compareStringsIgnoreCaseAndSpace(isValidNumSupplierSubnetNumber, numSupplierSubnetNumber)) {
            addElement('מספר  תת ספק  שגוי');
        }

        if (numBranchRetailer.trim() != "" && !compareStringsIgnoreCaseAndSpace(isValidNumBranchRetailer, numBranchRetailer)) {
            addElement('מספר  סניף  שגוי');
        }


        //line 3
        if (!compareStringsIgnoreCaseAndSpace(firstLine3row, LINE0001)) {
            addElement('LINE0001-ערך חסר');
        }

        if (!compareStringsIgnoreCaseAndSpace(lestline, HEAD9901)) {
            addElement('HEAD9901-ערך חסר');
        }

        if (!compareStringsIgnoreCaseAndSpace(lestline1, ENV00201)) {
            addElement('ENV00201-ערך חסר');
        }









    // function supdes() {
    //     console.log("Supdes function");
    //     // Add your logic for Supdes here
    // }
    //
    // function order() {
    //     console.log("Order function");
    //     // Add your logic for Order here
    // }
    //
    // // Event listener for structure selection
    // document.getElementById('menuTypeStructure').addEventListener('change', function () {
    //     var selectedStructureValue = this.value;
    //
    //     // Check the selected value and call the appropriate function
    //     switch (selectedStructureValue) {
    //         case 'fletFile':
    //
    //
    //
    //             document.getElementById('menuTypefile').addEventListener('change', function () {
    //                 var selectedFileValue = this.value;
    //
    //                 // Check the selected value and call the appropriate function
    //                 switch (selectedFileValue) {
    //                     case 'order':
    //                         order();
    //                         break;
    //                     // Add cases for other options as needed
    //                     case 'supdes':
    //                         supdes();
    //                         break;
    //                     // Default case if the selected option doesn't match any case
    //                     default:
    //                         console.log("Selected an option without a specific function.");
    //                         break;
    //                 }
    //             });
    //
    //
    //
    //             break;
    //         // Add cases for other options as needed
    //
    //         // Default case if the selected option doesn't match any case
    //         default:
    //             console.log("Selected an option without a specific function.");
    //             break;
    //     }
    // });

}















function chekFileHashavshevtSupdes(){
    myArray = [];
    myArraymessageRusltFromFile = [];
    function compareStringsIgnoreCaseAndSpace(valueFromFile, constantValue) {
        // Check if value is defined and not empty
        if (valueFromFile === undefined || valueFromFile.trim() === "") {
            return false;
        }
        // Remove spaces from both the value and target strings
        const formattedValue = valueFromFile.trim();
        const formattedTarget = constantValue.trim();

        // Check if the formatted value is exactly equal to the formatted target
        return formattedTarget === formattedValue;
    }




    const lines = fileContentSearch.split('\n');
    const secondToLastLine = lines[lines.length - 2];

    const numRetailer = document.getElementById('retailer').value;
    const numSupplier = document.getElementById('supplier').value;
    const numMessage = document.getElementById('message').value;
    const numSupplierSubnetNumber = document.getElementById('supplierSubnetNumber').value;
    const numBranchRetailer = document.getElementById('branchRetailer').value;



    let numSupplierBoolean = true;
    let isValidNumRetailerBoolean = true;
    let isValidNumSupplierSubnetNumberBoolean = true;
    let numSupplierSubnetNumberBoolean = true;
    let numpPackagingBoolean = true;
    let barcodeBoolean = true;
    let matchNumBranchBoolean = true;
    let numBranch1Boolean = true;
    let numBranch2Boolean = true;
    let pormatTime1Boolean = true;
    let pormatTime2Boolean = true;
    let dayDataTimeBoolean = true;
    let monthDataTimeBoolean = true;
    let yearDataTimeBoolean = true;

    let dayDataTime2Boolean = true;
    let monthDataTime2Boolean = true;
    let yearDataTime2Boolean = true;
    let numMessageBoolean = true;





    for (let i = 0; i < lines.length-1; i++) {
        myArraymessageRusltFromFile = [];
        const isValidNumSupplier = fileContentSearch.split('\n')[i].substring(10, 23);
        const isValidNumSupplierSubnetNumber = fileContentSearch.split('\n')[i].substring(24, 37);
        const isValidNumRetailer = fileContentSearch.split('\n')[i].substring(38, 51);
        const numpPackaging = fileContentSearch.split('\n')[i].substring(66, 82);
        const barcode = fileContentSearch.split('\n')[i].substring(87, 102);
        const numBranch1 = fileContentSearch.split('\n')[i].substring(103, 133);
        const numBranch2 = fileContentSearch.split('\n')[i].substring(134, 142);
        const dataTime = fileContentSearch.split('\n')[i].substring(143, 151);
        const dataTime2 = fileContentSearch.split('\n')[i].substring(159, 167);

        const dayDataTime = Number(dataTime.substring(0, 2));
        const monthDataTime = Number(dataTime.substring(3, 5));
        const yearDataTime = Number(dataTime.substring(6, 8));

        const dayDataTime2 = Number(dataTime2.substring(0, 2));
        const monthDataTime2 = Number(dataTime2.substring(3, 5));
        const yearDataTime2 = Number(dataTime2.substring(6, 8));



        const isValidnumMessage = fileContentSearch.split('\n')[i].substring(151, 158);


        // if (numRetailer1===undefined){
        //     addElementmessageRusltFromFile("רשת: רשת לא קיימת ");
        // }else {
        //     addElementmessageRusltFromFile("רשת: "+numRetailer1);
        // }
        //
        // addElementmessageRusltFromFile(isValidNumSupplier+":מספר ספק ");
        // addElementmessageRusltFromFile(isValidnumMessage+":מספר תעודה ");
        // addElementmessageRusltFromFile(numBranch1+":מספר סניף/מפתח ");



        if (!compareStringsIgnoreCaseAndSpace(isValidNumSupplier, numSupplier)) {
            numSupplierBoolean = false;
            addElement("מספר ספק שגוי שורה "+ (i + 1));

        }

        if (!compareStringsIgnoreCaseAndSpace(isValidNumRetailer, numRetailer)) {
            isValidNumRetailerBoolean = false;
            addElement("מספר רשת שגוי שורה "+ (i + 1));
        }



        if (numSupplierSubnetNumber!=""){
            if (!compareStringsIgnoreCaseAndSpace(isValidNumSupplierSubnetNumber, numSupplier)) {
                isValidNumSupplierSubnetNumberBoolean = false;
                addElement("מספר ספק משני שגוי שורה " + (i + 1));
            }
        }



        if (numSupplierSubnetNumber!=""){
            if (!compareStringsIgnoreCaseAndSpace(isValidNumSupplierSubnetNumber, numSupplierSubnetNumber)) {
                numSupplierSubnetNumberBoolean = false;
                addElement("מספר תת ספק  שגוי שורה "+ (i + 1));
            }
        }

        if (numpPackaging.trim()===""){
            numpPackagingBoolean = false;
            addElement("מספר אריזות חסר שורה "+ (i + 1));
        }

        if (barcode.trim()===""){
            matchNumBranchBoolean = false;
            addElement("ברקוד חסר שורה "+ (i + 1));
        }


        if (numBranch1.trim()!= numBranch2.trim()){
            numSupplierSubnetNumberBoolean = false;
            addElement("חוסר התאמה במספר מפתח בשורה "+ (i + 1));
        }



        if (numBranch1.trim()===""){
            numBranch1Boolean = false;
            addElement("מספר מפתח חסר שורה "+ (i + 1));
        }

        if (numBranch2.trim()===""){
            numBranch2Boolean = false;
            addElement("מספר מפתח חסר שורה "+ (i + 1));
        }



        if (dataTime.trim().length!=8 || String(dataTime.substring(2, 3))!="/" || String(dataTime.substring(5, 6))!="/"){
            pormatTime1Boolean=false;
            addElement("פורמט תאריך משלוח שגוי "+ (i + 1));
        }


        if (dataTime2.trim().length!=8 || String(dataTime2.substring(2, 3))!="/" || String(dataTime2.substring(5, 6))!="/"){
            pormatTime2Boolean=false;
            addElement("פורמט תאריך תוקף שגוי "+ (i + 1));
        }


        if (dayDataTime<0 || dayDataTime>31){
            dayDataTimeBoolean=false;
            addElement("פורמט תאריך משלוח שדה -יום, שגוי. שורה "+ (i + 1));
        }

        if (monthDataTime<1 || monthDataTime>12){
            monthDataTimeBoolean=false;
            addElement("פורמט תאריך משלוח שדה -חודש, שגוי. שורה "+ (i + 1));
        }
        if (yearDataTime<23 ){
            yearDataTimeBoolean=false;
            addElement("פורמט תאריך משלוח שדה -שנה, שגוי. שורה "+ (i + 1));
        }




        if (dayDataTime2<0 || dayDataTime2>31){
            dayDataTime2Boolean=false;
            addElement("פורמט תאריך תוקף שדה -יום, שגוי. שורה "+ (i + 1));
        }

        if (monthDataTime2<1 || monthDataTime2>12){
            monthDataTime2Boolean=false;
            addElement("פורמט תאריך תוקף שדה -חודש, שגוי. שורה "+ (i + 1));
        }
        if (yearDataTime2<23 ){
            yearDataTime2Boolean=false;
            addElement("פורמט תאריך תוקף שדה -שנה, שגוי. שורה "+ (i + 1));
        }


        // if (!compareStringsIgnoreCaseAndSpace(isValidnumMessage, numMessage)) {
        //     numMessageBoolean = false;
        //     addElement("מספר תעודה שגוי שורה "+ (i + 1));
        //
        // }

        if (numMessage.trim()!=""){
            if(!compareStringsIgnoreCaseAndSpace(isValidnumMessage, numMessage)) {
                numMessageBoolean = false;
                addElement("מספר תעודה שגוי שורה "+ (i + 1));
            }
        }




    }






// Check the flag to determine if all elements were equal
    if (numSupplierBoolean && isValidNumRetailerBoolean && isValidNumSupplierSubnetNumberBoolean
        && numSupplierSubnetNumberBoolean
        && numpPackagingBoolean
        && barcodeBoolean
        && matchNumBranchBoolean
        && numBranch2Boolean
        && numBranch1Boolean
        && pormatTime1Boolean
        && pormatTime2Boolean
        && dayDataTimeBoolean
        && monthDataTimeBoolean
        && yearDataTimeBoolean
        && dayDataTime2Boolean
        && monthDataTime2Boolean
        && yearDataTime2Boolean
        && numMessageBoolean


    )
    {
        addElement("תעודה תקינה");
    }


}









