// // https://v6.exchangerate-api.com/v6/6be4628aab01dae1a2ff806f/latest/USD

const currencyList = document.querySelectorAll('select');
const input = document.querySelector('input') as HTMLInputElement;
const convertButton = document.querySelector('.convert-button') as HTMLElement;
const result = document.querySelector('.result') as HTMLElement;
const originalCurrency = document.querySelector("#original-currency") as HTMLSelectElement;
const convertToCurrency = document.querySelector("#convert-to-currency") as HTMLSelectElement;
let allCurrencyNames: [string, string][] = [];


interface Data {
    name: {
        common: string,
        official: string,
        nativename?: object
    },
    currencies: object,
    flag: string
}


const fetchCurrencies = async () => {

    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies,flag');
        const data: Data[] = await response.json();


        data.forEach(obj => {
            if (obj.currencies) {

                const keys = Object.keys(obj.currencies);

                keys.forEach(key => {
                    const name: string = obj.currencies[key].name;
                    allCurrencyNames.push([key, name]);

                })
                keys.forEach(key => {
                    const name: string = obj.currencies[key].name;

                    const option = document.createElement('option');
                    option.innerText = `${key} - ${name}`;
                    option.value = key;
                    currencyList[0].appendChild(option);

                    const option2 = document.createElement('option');
                    option2.innerText = `${key} - ${name}`;
                    option2.value = key;
                    currencyList[1].appendChild(option2);
                })

            }
        })
    }
    catch (error) {
        console.log("Failed to fetch currencies:", error);
        alert("Error fetching currency data. Please try again later.");
    }
}

fetchCurrencies();


const fetchConversionRate = async (currency1: string, currency2: string) => {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/6be4628aab01dae1a2ff806f/pair/${currency1}/${currency2}`);
        const data = await response.json();

        const cRate = data.conversion_rate as number;
        return cRate;
    }
    catch (error) {
        console.log("Failed to fetch conversion rate:", error);
        throw new Error("Error fetching conversion rate.");
    }
}



const convert = async () => {
    const inputValue = Number(input.value);
    if (isNaN(inputValue) || inputValue <= 0) {
        alert("Please enter a number.");
        input.value = "";
        return;
    }

    if (!originalCurrency.value || !convertToCurrency.value) {
        alert("Please select both currencies.");
        return;
    }

    const currency1: string = originalCurrency.value.slice(0, 3);
    const currency2: string = convertToCurrency.value.slice(0, 3);
    // console.log(curr2)

    const conversionRate = await fetchConversionRate(currency1, currency2);
    const amount = inputValue * conversionRate;
    result.innerHTML = `${inputValue} ${currency1} = ${amount} ${currency2}`;

}

convertButton.addEventListener('click', convert);


