const orderTimeAll = document.querySelectorAll(".order-time");
orderTimeAll.forEach((orderTime) => {
    // orderTime.textContent = moment(new Date(orderTime.textContent)).format("llll");
    orderTime.textContent = moment(new Date(orderTime.textContent)).format("MMM Do YY, h:mm a");
})


const adminOrderTimeAll = document.querySelectorAll(".adminOrder-time");;
adminOrderTimeAll.forEach((adminOrderTimeAll) => {
    // adminOrderTimeAll.textContent = moment(new Date(adminOrderTimeAll.textContent)).format("llll");
    adminOrderTimeAll.textContent = moment(new Date(adminOrderTimeAll.textContent)).format("MMM Do YY, h:mm a");
})


const statusOptions = document.querySelectorAll("select option");
statusOptions.forEach((option) => {
    if (option.className === option.value){
        option.setAttribute('selected', true);
    }
})
