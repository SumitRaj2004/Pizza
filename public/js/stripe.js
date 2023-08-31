const stripe = Stripe("pk_test_51Nkw0kSJKWhxKjx3pPFJbvaRzMyHqjTkwNQbCQ1t1yEaSi28URnelQ3A4XXHpYY5q9SDUGP0sUI7gFRNtpSIYWSD00veLcaA9Q")
const checkoutForm = document.querySelector(".checkout-form");
checkoutForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const phoneInput = document.querySelector(".phone");
    const addressInput = document.querySelector(".address");
    const cartId = checkoutForm.getAttribute("data-cart");
    const body = {
        phone : phoneInput.value,
        address : addressInput.value,
        cartId : cartId
    }
    if (phoneInput.value.trim() && addressInput.value.trim()){
        const res = await fetch("/create-checkout-session", {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify(body)
        })
        const session = await res.json();
        const result = stripe.redirectToCheckout({
            sessionId : session.id
        })
    }
})