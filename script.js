var Lab3B = (function () {
  var rates = null;

  var createCurrencyMenu = function (currencies) {

    var menu = $("#currencymenu");
    menu.empty(); // Clear the menu
  
    $.each(currencies, function (index, currency) {
      var option = $("<option>")
        .val(currency.code)
        .text(currency.code + " (" + currency.name + ")");
      menu.append(option);
    });
  
    // Trigger change event to ensure initial currency code is set
    menu.trigger("change");

    menu.on("change", handleCurrencyChange);
  };

  var handleCurrencyChange = function () {
    var targetCurrency = $("#currencymenu").val();
    var rateToTarget = rates.rates[targetCurrency];
  
    if (typeof rateToTarget === "undefined") {
      console.log("Invalid currency code:", targetCurrency);
      return;
    }
  
    convert();
  };

  var convert = function () {
    
    var usdValue = parseFloat($("#usd_value").val());
    var targetCurrency = $("#currencymenu").val();
    var rateToEuro = rates.rates["EUR"];
    var rateToTarget = rates.rates[targetCurrency];
    
    console.log("Target Currency:", targetCurrency);
    console.log("Rate to Euro:", rateToEuro);
    console.log("Rate to Target:", rateToTarget);

    var convertedValue = (usdValue / rateToEuro) * rateToTarget;

    var currencyOptions = {
      style: "currency",
      currency: targetCurrency,
      currencyDisplay: "symbol",
    };

    var outputDiv = $("#output");
    outputDiv.html(
      "<p>Converted value: " +
        convertedValue.toLocaleString("en-US", currencyOptions) +
        "</p>"
    );
  };

  var getRatesAndConvert = function (rate_date) {
    console.log("Getting rates for " + rate_date + " ...");

    $.ajax({
      url: "https://testbed.jaysnellen.com:8443/JSUExchangeRatesServer/rates?=",
      dataType: "json",
      success: function (result) {
        rates = result;
        convert();
      },
      error: function (error) {
        console.log("Error retrieving rates:", error);
      },
    });
  };

  return {
    getCurrenciesList: function () {
      
      $.ajax({
        url: "https://testbed.jaysnellen.com:8443/JSUExchangeRatesServer/currencies?=",
        dataType: "json",
        success: function (result) {
          var currencies = Object.keys(result.rates).map(function (key) {
            return { code: key, name: "" };
          });
          createCurrencyMenu(currencies);
        },
        error: function (error) {
          console.log("Error retrieving currencies:", error);
        },
      });
    },

    onClick: function () {
      var rate_date = $("#rate_date").val();

      if (rate_date === "") {
        alert('Please enter or select a date in the "Date" field!');
      } else {
        // if rates have not been retrieved yet, or if the date is different, fetch new rates

        if (rates === null || rate_date !== rates["date"]) {
          getRatesAndConvert(rate_date);
        }

        // if rates for the selected date are already available, perform the conversion
        else {
          convert();
        }
      }
    },
  };
})();
