const selectCode = document.getElementById('code-type');
const chanelType = document.getElementById('chanel');
const form = document.getElementById('form');
const submitBtn = document.getElementById('submit');
const main = document.querySelector('main');
const download = document.getElementById('download');
const deleteBtn = document.getElementById('delete');
const loading = document.querySelector('.loader');
const load = document.getElementById('loader-container');
let arrWithVouchers;

// Initialize app
function init(){
   // Get Vouchers data
   arrWithVouchers = getVouchersData();
   
   // Create All Cards
   arrWithVouchers.forEach( item => createCard(item));
}

init();


// Generate random voucher code
 function voucherCode(length) {
   for (var s=''; s.length < length; s += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.random()*62|0));
   return s;
 }

 // Show Loading
function showLoading(e){
   e.preventDefault();

   if(chanelType.value === ''){
      showAlert(chanelType, 'Chanel of Advertizing iz Required');
   } else{
      load.classList.add('show-loader');
      loading.classList.add('show');

      setTimeout(() =>{
         load.classList.remove('show-loader');
         loading.classList.remove('show');
         createNewVoucherFromFormSubmit();
      },2000);
   }
}


//CreateNewVoucherFromFormSubmit
function createNewVoucherFromFormSubmit(){
     //   Set parameters
      let selectDiscount = selectCode.value;
      let voucherCodeGenerated = voucherCode(6);
      let chanel = chanelType.value;
      let dateNow;
      let date = new Date();
      dateNow = date.toDateString();
      let imgSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${voucherCodeGenerated}`

     // Create Voucher Object
      let oneCardInfo = {
         "date":     dateNow,
         "discount": selectDiscount,
         "chanel":   chanel,
         "voucher":  voucherCodeGenerated,
         "number":   1,
         "qrImg":   imgSrc
      }

      // arrWithVouchers.push(oneCardInfo);     
      setVoucherToStorage(oneCardInfo);
      createCard(oneCardInfo);
      chanelType.value = '';   
}

      
      
// Create Card
function createCard(oneCardInfo){
   const div = document.createElement('div');
   div.classList.add('code');
   // Create DOM Element
   div.innerHTML = `
      <div id="date" class="date">${oneCardInfo.date}</div>
      <div id="type-output"  class="type-output">${oneCardInfo.discount}</div>
      <div id="chanel-output" class="chanel-output">${oneCardInfo.chanel}</div>
      <div id="count" class="count">${oneCardInfo.number}</div>
      <img src="${oneCardInfo.qrImg}" id="qr-code" class="qr-code">
      <a href="${oneCardInfo.qrImg}" class="link" download="qr code" target="_blank" id="download">Download<i class="fa fa-download"></i></a>
      <button id="delete" class="btn btn-delete">X</button>
      `;
   main.appendChild(div); 
}

// Show Alert
function showAlert(chanel, message){
   const formControl = chanel.parentElement;
   formControl.classList.add('error');
   const small = formControl.querySelector('small');
   small.innerText = message;

   // Disappear after 3 sec
   setTimeout(clearError, 3000);
}

// Clear Error
function clearError(){
   chanel.parentElement.classList.remove('error');
}


// Set data in LS
function setVoucherToStorage(item){
   let items;
   if(localStorage.getItem('items') === null){
      items = [];
   } else{
      items = JSON.parse(localStorage.getItem('items'));
   }
   items.push(item);
   localStorage.setItem('items', JSON.stringify(items));
}

// Get data from Local Storage
function getVouchersData(){
   const data = JSON.parse(localStorage.getItem('items'));
   return data === null ? [] : data;
}

// Remove One card
function removeCard(e){
   if(e.target.classList.contains('btn-delete')){
      if(confirm('Are you sure?')){
         e.target.parentElement.remove();
         removeCardFromStorage(e.target.parentElement.textContent);
      }
   }
}

// Remove Card From Storage
function removeCardFromStorage(identifier){
   let items;
   if(localStorage.getItem('items') === null){
      items = [];
   } else{
      items = JSON.parse(localStorage.getItem('items'));
   }
   let id;
        items.forEach((el,index) => {
            id = el.identifier === identifier && index;
        });
        items.splice(id,1)
  
   localStorage.setItem('items', JSON.stringify(items));
}


//EVENT LISTENERS

   // Create Card
   form.addEventListener('submit', showLoading);
   // Remove One Card
   main.addEventListener('click', removeCard);



