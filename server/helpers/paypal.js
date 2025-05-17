const paypal = require("paypal-rest-sdk");

paypal.configure({
    mode: "sandbox",
    client_id: "AVznAx8rc549p0RvNrLVbWSpGcSFBSwFBoWuYHyvtNHxMPsSRuyeY7eDxMsVrQzOFklFIvKjkAflL34h",
    client_secret: "EN9Ea7z5yfe1o6L8V5ggRY_VI6lVIP7V8QVsQVkdVNuvwMHKTxRyobbWD7tYm1A7GRr_LHC8Cw1VdPjR",
});

module.exports = paypal;